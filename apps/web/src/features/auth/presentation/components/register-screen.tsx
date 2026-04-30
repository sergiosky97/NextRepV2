"use client";

import LogoSvg from "@nextrep/assets/icons/svg/logo.svg";
import { tokens, createTheme } from "@nextrep/ui/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "../../../../providers/i18n-provider";
import { useAuthStore } from "../../application/auth.store";
import { useRegister } from "../../application/use-register";
import { registerFormSchema } from "../../domain/login-form.schema";

export function RegisterScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const register = useRegister();
  const theme = createTheme("light");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) router.replace("/home");
  }, [router, session]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = registerFormSchema.safeParse({
      firstName,
      lastName,
      phone: phone || undefined,
      email: email || undefined,
      password,
      confirmPassword
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos invalidos");
      return;
    }

    setError("");
    try {
      await register.mutateAsync({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        password: parsed.data.password
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("auth.genericError"));
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    border: `1px solid ${theme.border}`
  };

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
          maxWidth: 500,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          display: "grid",
          gap: tokens.spacing.md
        }}
      >
        <h1 style={{ margin: 0, textAlign: "center", fontSize: tokens.typography.title }}>
          <span style={{ display: "inline-grid", placeItems: "center", gap: tokens.spacing.sm }}>
            <LogoSvg width={120} height={32} />
            Registro
          </span>
        </h1>
        <input placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
        <input placeholder="Apellidos" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
        <input placeholder="Telefono" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        <input placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Contrasena" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Confirmar contrasena" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
        {error ? <p style={{ color: tokens.color.danger, margin: 0 }}>{error}</p> : null}
        <button
          disabled={register.isPending}
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
          {register.isPending ? "..." : "Crear cuenta"}
        </button>
        <Link href="/login" style={{ textAlign: "center", color: theme.text }}>
          Volver a login
        </Link>
      </form>
    </main>
  );
}
