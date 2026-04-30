"use client";

import { tokens, createTheme } from "@nextrep/ui/index";
import LogoSvg from "@nextrep/assets/icons/svg/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "../../../../providers/i18n-provider";
import { useAuthStore } from "../../application/auth.store";
import { useLogin } from "../../application/use-login";
import { loginFormSchema } from "../../domain/login-form.schema";

export function LoginScreen() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const login = useLogin();
  const theme = createTheme("light");

  useEffect(() => {
    if (session) router.replace("/home");
  }, [router, session]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = loginFormSchema.safeParse({ email, password });
    if (!parsed.success) {
      const code = parsed.error.issues[0]?.path[0];
      setError(code === "email" ? t("auth.invalidEmail") : t("auth.shortPassword"));
      return;
    }

    setError("");
    try {
      await login.mutateAsync({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("auth.genericError"));
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: theme.background,
        color: theme.text,
        padding: tokens.spacing.xl
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          display: "grid",
          gap: tokens.spacing.lg
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center", fontSize: tokens.typography.title }}>
          <span style={{ display: "inline-grid", placeItems: "center", gap: tokens.spacing.sm }}>
            <LogoSvg width={120} height={32} />
            {t("auth.title")}
          </span>
        </h1>
        <label style={{ display: "grid", gap: tokens.spacing.sm }}>
          {t("auth.emailLabel")}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            style={{
              padding: tokens.spacing.md,
              borderRadius: tokens.radius.md,
              border: `1px solid ${theme.border}`
            }}
          />
        </label>
        <label style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          Recordar sesion
        </label>
        <label style={{ display: "grid", gap: tokens.spacing.sm }}>
          {t("auth.passwordLabel")}
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            style={{
              padding: tokens.spacing.md,
              borderRadius: tokens.radius.md,
              border: `1px solid ${theme.border}`
            }}
          />
        </label>
        {error ? <p style={{ color: tokens.color.danger, margin: 0 }}>{error}</p> : null}
        <button
          disabled={login.isPending}
          style={{
            width: "100%",
            padding: tokens.spacing.md,
            border: "none",
            borderRadius: tokens.radius.md,
            background: tokens.color.primary,
            color: tokens.color.primaryText,
            fontWeight: 700
          }}
        >
          {login.isPending ? "..." : t("auth.loginButton")}
        </button>
        <div style={{ textAlign: "center", display: "grid", gap: tokens.spacing.sm }}>
          <Link href="/forgot-password" style={{ color: theme.text }}>
            Olvide mi contrasena
          </Link>
          <small>{t("auth.secondaryHelp")}</small>
          <Link
            href="/register"
            style={{
              display: "inline-block",
              border: `1px solid ${theme.border}`,
              background: "transparent",
              borderRadius: tokens.radius.md,
              padding: tokens.spacing.sm,
              color: theme.text,
              textDecoration: "none"
            }}
          >
            {t("auth.secondaryAction")}
          </Link>
        </div>
      </form>
    </main>
  );
}
