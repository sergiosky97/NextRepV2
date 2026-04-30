"use client";

import { createTheme, tokens } from "@nextrep/ui/index";
import Link from "next/link";
import { useState } from "react";
import { useRequireAuth } from "../../../auth/application/use-require-auth";
import { useAuthStore } from "../../../auth/application/auth.store";
import { authApiRepository } from "../../../auth/infrastructure/auth-api.repository";

export function SettingsScreen() {
  const session = useRequireAuth();
  const setSession = useAuthStore((state) => state.setSession);
  const theme = createTheme(session?.user.themeMode ?? "light");
  const [avatarUrl, setAvatarUrl] = useState(session?.user.avatarUrl ?? "");
  const [language, setLanguage] = useState(session?.user.language ?? "es");
  const [themeMode, setThemeMode] = useState<"light" | "dark">(session?.user.themeMode ?? "light");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!session?.accessToken || !session) return;
    setError("");
    try {
      const user = await authApiRepository.updatePreferences(session.accessToken, {
        avatarUrl: avatarUrl || null,
        language,
        themeMode
      });
      setSession({ ...session, user });
      setMessage("Preferencias guardadas correctamente.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudieron guardar cambios");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: theme.background, color: theme.text, padding: tokens.spacing.xl }}>
      <form
        onSubmit={onSave}
        style={{
          maxWidth: 560,
          margin: "0 auto",
          display: "grid",
          gap: tokens.spacing.md,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl
        }}
      >
        <h2 style={{ margin: 0 }}>Ajustes</h2>
        <label style={{ display: "grid", gap: tokens.spacing.xs }}>
          URL de foto de perfil
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: tokens.spacing.xs }}>
          Tema
          <select value={themeMode} onChange={(e) => setThemeMode(e.target.value as "light" | "dark")}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: tokens.spacing.xs }}>
          Idioma
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="es">Espanol</option>
            <option value="en">English</option>
          </select>
        </label>
        {message ? <p style={{ margin: 0 }}>{message}</p> : null}
        {error ? <p style={{ color: tokens.color.danger, margin: 0 }}>{error}</p> : null}
        <button
          type="submit"
          style={{
            border: "none",
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md,
            background: tokens.color.primary,
            color: tokens.color.primaryText
          }}
        >
          Guardar cambios
        </button>
        <Link href="/home">Volver al home</Link>
      </form>
    </main>
  );
}
