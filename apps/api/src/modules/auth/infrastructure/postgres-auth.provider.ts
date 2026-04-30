import { Injectable, OnModuleInit } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { randomBytes, randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { AuthProviderPort, LoginCommand } from "../application/auth-provider.port";
import { AuthSessionEntity, AuthUserEntity } from "../domain/auth-user.entity";

type UserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  password_hash: string;
  refresh_token_hash: string | null;
  avatar_url: string | null;
  theme_mode: "light" | "dark";
  language: string;
};

type ResetTokenRow = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
};

@Injectable()
export class PostgresAuthProvider implements AuthProviderPort, OnModuleInit {
  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  private readonly jwtSecret = process.env.JWT_SECRET ?? "dev-jwt-secret-change-me";
  private useMemoryFallback = false;
  private readonly memoryUsers = new Map<string, UserRow>();
  private readonly memoryResetTokens = new Array<ResetTokenRow>();

  async onModuleInit() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS app_users (
          id UUID PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE,
          phone TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          refresh_token_hash TEXT,
          avatar_url TEXT,
          theme_mode TEXT NOT NULL DEFAULT 'light',
          language TEXT NOT NULL DEFAULT 'es',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await this.pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`);
      await this.pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS theme_mode TEXT NOT NULL DEFAULT 'light';`);
      await this.pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es';`);
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id UUID PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
          token_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          used_at TIMESTAMPTZ
        );
      `);
    } catch (error) {
      this.useMemoryFallback = true;
      const message = error instanceof Error ? error.message : "unknown";
      console.warn(`[auth] PostgreSQL unavailable, using memory fallback: ${message}`);
    }
  }

  private toAuthUser(user: UserRow): AuthUserEntity {
    return {
      id: user.id,
      email: user.email ?? "",
      phone: user.phone,
      displayName: `${user.first_name} ${user.last_name}`.trim(),
      avatarUrl: user.avatar_url,
      themeMode: user.theme_mode ?? "light",
      language: user.language ?? "es"
    };
  }

  private issueTokens(userId: string) {
    const accessToken = jwt.sign({ sub: userId, type: "access" }, this.jwtSecret, {
      expiresIn: "15m"
    });
    const refreshToken = jwt.sign({ sub: userId, type: "refresh" }, this.jwtSecret, {
      expiresIn: "30d"
    });
    return { accessToken, refreshToken };
  }

  private async createSession(user: UserRow): Promise<AuthSessionEntity> {
    const { accessToken, refreshToken } = this.issueTokens(user.id);
    const refreshHash = await hash(refreshToken, 10);
    if (this.useMemoryFallback) {
      user.refresh_token_hash = refreshHash;
      this.memoryUsers.set(user.id, user);
    } else {
      await this.pool.query(`UPDATE app_users SET refresh_token_hash = $1 WHERE id = $2`, [
        refreshHash,
        user.id
      ]);
    }
    return {
      accessToken,
      refreshToken,
      user: this.toAuthUser(user)
    };
  }

  async signIn(command: LoginCommand): Promise<AuthSessionEntity> {
    const identifier = command.email ?? command.phone;
    if (!identifier) throw new Error("Debes indicar correo o telefono.");
    if (this.useMemoryFallback) {
      const user = [...this.memoryUsers.values()].find(
        (item) => item.email === identifier || item.phone === identifier
      );
      if (!user) throw new Error("No existe una cuenta con esos datos.");
      const ok = await compare(command.password, user.password_hash);
      if (!ok) throw new Error("Contrasena incorrecta.");
      return this.createSession(user);
    }

    const { rows } = await this.pool.query<UserRow>(
      `SELECT * FROM app_users WHERE email = $1 OR phone = $1 LIMIT 1`,
      [identifier]
    );
    const user = rows[0];
    if (!user) throw new Error("No existe una cuenta con esos datos.");

    const ok = await compare(command.password, user.password_hash);
    if (!ok) throw new Error("Contrasena incorrecta.");
    return this.createSession(user);
  }

  async signUp(command: LoginCommand): Promise<AuthSessionEntity> {
    if (!command.firstName || !command.lastName) {
      throw new Error("Nombre y apellidos son obligatorios.");
    }
    if (!command.email && !command.phone) {
      throw new Error("Debes indicar correo o telefono.");
    }

    const email = command.email?.trim().toLowerCase() || null;
    const phone = command.phone?.trim() || null;
    const passwordHash = await hash(command.password, 10);
    const userId = randomUUID();
    if (this.useMemoryFallback) {
      const duplicated = [...this.memoryUsers.values()].some(
        (item) => (email && item.email === email) || (phone && item.phone === phone)
      );
      if (duplicated) {
        throw new Error(email ? "Ese correo ya esta en uso." : "Ese telefono ya esta en uso.");
      }
      const user: UserRow = {
        id: userId,
        first_name: command.firstName,
        last_name: command.lastName,
        email,
        phone,
        password_hash: passwordHash,
        refresh_token_hash: null,
        avatar_url: null,
        theme_mode: "light",
        language: "es"
      };
      this.memoryUsers.set(user.id, user);
      return this.createSession(user);
    }

    try {
      const { rows } = await this.pool.query<UserRow>(
        `INSERT INTO app_users (id, first_name, last_name, email, phone, password_hash, avatar_url, theme_mode, language)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [userId, command.firstName, command.lastName, email, phone, passwordHash, null, "light", "es"]
      );
      return this.createSession(rows[0]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("app_users_email_key")) throw new Error("Ese correo ya esta en uso.");
      if (message.includes("app_users_phone_key")) throw new Error("Ese telefono ya esta en uso.");
      throw new Error("No se pudo crear la cuenta. Intenta nuevamente.");
    }
  }

  async refreshSession(refreshToken: string): Promise<AuthSessionEntity> {
    try {
      const payload = jwt.verify(refreshToken, this.jwtSecret) as { sub: string; type: string };
      if (payload.type !== "refresh") throw new Error("Token invalido.");
      if (this.useMemoryFallback) {
        const user = this.memoryUsers.get(payload.sub);
        if (!user?.refresh_token_hash) throw new Error("Sesion expirada.");
        const ok = await compare(refreshToken, user.refresh_token_hash);
        if (!ok) throw new Error("Sesion invalida.");
        return this.createSession(user);
      }

      const { rows } = await this.pool.query<UserRow>(`SELECT * FROM app_users WHERE id = $1`, [
        payload.sub
      ]);
      const user = rows[0];
      if (!user?.refresh_token_hash) throw new Error("Sesion expirada.");

      const ok = await compare(refreshToken, user.refresh_token_hash);
      if (!ok) throw new Error("Sesion invalida.");
      return this.createSession(user);
    } catch {
      throw new Error("Tu sesion ha expirado. Inicia sesion de nuevo.");
    }
  }

  async signOut(accessToken: string): Promise<void> {
    const payload = jwt.verify(accessToken, this.jwtSecret) as { sub: string };
    if (this.useMemoryFallback) {
      const user = this.memoryUsers.get(payload.sub);
      if (user) user.refresh_token_hash = null;
      return;
    }
    await this.pool.query(`UPDATE app_users SET refresh_token_hash = NULL WHERE id = $1`, [
      payload.sub
    ]);
  }

  async getUserByAccessToken(accessToken: string): Promise<AuthUserEntity | null> {
    try {
      const payload = jwt.verify(accessToken, this.jwtSecret) as { sub: string; type: string };
      if (payload.type !== "access") return null;
      if (this.useMemoryFallback) {
        const user = this.memoryUsers.get(payload.sub);
        return user ? this.toAuthUser(user) : null;
      }
      const { rows } = await this.pool.query<UserRow>(`SELECT * FROM app_users WHERE id = $1`, [
        payload.sub
      ]);
      return rows[0] ? this.toAuthUser(rows[0]) : null;
    } catch {
      return null;
    }
  }

  async requestPasswordReset(
    emailOrPhone: string
  ): Promise<{ success: true; message: string }> {
    if (this.useMemoryFallback) {
      const user = [...this.memoryUsers.values()].find(
        (item) => item.email === emailOrPhone || item.phone === emailOrPhone
      );
      if (!user) {
        return {
          success: true,
          message: "Si existe una cuenta, hemos enviado instrucciones para recuperarla."
        };
      }
      const plainToken = randomBytes(24).toString("hex");
      const tokenHash = await hash(plainToken, 10);
      this.memoryResetTokens.push({
        id: randomUUID(),
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
        used_at: null
      });
      return { success: true, message: `Token temporal generado (dev): ${plainToken}` };
    }

    const { rows } = await this.pool.query<UserRow>(
      `SELECT * FROM app_users WHERE email = $1 OR phone = $1 LIMIT 1`,
      [emailOrPhone]
    );
    const user = rows[0];
    if (!user) {
      return {
        success: true,
        message: "Si existe una cuenta, hemos enviado instrucciones para recuperarla."
      };
    }

    const plainToken = randomBytes(24).toString("hex");
    const tokenHash = await hash(plainToken, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 20); // 20m

    await this.pool.query(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [randomUUID(), user.id, tokenHash, expiresAt.toISOString()]
    );

    return {
      success: true,
      message: `Token temporal generado (dev): ${plainToken}`
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (this.useMemoryFallback) {
      const valid: Array<{ row: ResetTokenRow; matches: boolean }> = await Promise.all(
        this.memoryResetTokens
          .filter((row) => !row.used_at)
          .map(async (row: ResetTokenRow) => ({
            row,
            matches: await compare(token, row.token_hash)
          }))
      );
      const match = valid.find((item) => item.matches)?.row;
      if (!match) throw new Error("Token de recuperacion invalido.");
      if (new Date(match.expires_at).getTime() < Date.now()) {
        throw new Error("El token de recuperacion ha expirado.");
      }
      const user = this.memoryUsers.get(match.user_id);
      if (!user) throw new Error("Usuario no encontrado.");
      user.password_hash = await hash(newPassword, 10);
      user.refresh_token_hash = null;
      match.used_at = new Date().toISOString();
      return;
    }

    const { rows } = await this.pool.query<ResetTokenRow>(
      `SELECT * FROM password_reset_tokens
       WHERE used_at IS NULL
       ORDER BY expires_at DESC`
    );

    const valid: Array<{ row: ResetTokenRow; matches: boolean }> = await Promise.all(
      rows.map(async (row: ResetTokenRow) => ({
        row,
        matches: await compare(token, row.token_hash)
      }))
    );
    const match = valid.find((item: { row: ResetTokenRow; matches: boolean }) => item.matches)?.row;
    if (!match) throw new Error("Token de recuperacion invalido.");
    if (new Date(match.expires_at).getTime() < Date.now()) {
      throw new Error("El token de recuperacion ha expirado.");
    }

    const passwordHash = await hash(newPassword, 10);
    await this.pool.query(`UPDATE app_users SET password_hash = $1 WHERE id = $2`, [
      passwordHash,
      match.user_id
    ]);
    await this.pool.query(`UPDATE app_users SET refresh_token_hash = NULL WHERE id = $1`, [
      match.user_id
    ]);
    await this.pool.query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`, [
      match.id
    ]);
  }

  async updatePreferences(
    accessToken: string,
    payload: { themeMode?: "light" | "dark"; language?: string; avatarUrl?: string | null }
  ): Promise<AuthUserEntity> {
    const decoded = jwt.verify(accessToken, this.jwtSecret) as { sub: string };
    const userId = decoded.sub;
    if (this.useMemoryFallback) {
      const user = this.memoryUsers.get(userId);
      if (!user) throw new Error("Usuario no encontrado.");
      if (payload.themeMode) user.theme_mode = payload.themeMode;
      if (payload.language) user.language = payload.language;
      if (payload.avatarUrl !== undefined) user.avatar_url = payload.avatarUrl;
      this.memoryUsers.set(userId, user);
      return this.toAuthUser(user);
    }
    const { rows } = await this.pool.query<UserRow>(
      `UPDATE app_users
       SET theme_mode = COALESCE($1, theme_mode),
           language = COALESCE($2, language),
           avatar_url = CASE WHEN $3::text IS NULL THEN avatar_url ELSE $3 END
       WHERE id = $4
       RETURNING *`,
      [payload.themeMode ?? null, payload.language ?? null, payload.avatarUrl ?? null, userId]
    );
    if (!rows[0]) throw new Error("Usuario no encontrado.");
    return this.toAuthUser(rows[0]);
  }
}
