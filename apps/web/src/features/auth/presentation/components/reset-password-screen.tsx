"use client";

import { tokens, createTheme } from "@nextrep/ui/index";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useResetPassword } from "../../application/use-reset-password";

export function ResetPasswordScreen() {
  const router = useRouter();
  const resetPassword = useResetPassword();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const theme = createTheme("light");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !password) {
      setError("Token y contrasena son obligatorios.");
      return;
    }
    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contrasenas no coinciden.");
      return;
    }
    setError("");
    try {
      await resetPassword.mutateAsync({ token, newPassword: password });
      setMessage("Contrasena actualizada correctamente.");
      setTimeout(() => router.push("/login"), 1000);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar la contrasena");
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: theme.background }}>
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
          gap: tokens.spacing.md
        }}
      >
        <h2 style={{ margin: 0 }}>Nueva contrasena</h2>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token" style={{ padding: tokens.spacing.md, borderRadius: tokens.radius.md, border: `1px solid ${theme.border}` }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nueva contrasena" style={{ padding: tokens.spacing.md, borderRadius: tokens.radius.md, border: `1px solid ${theme.border}` }} />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmar contrasena" style={{ padding: tokens.spacing.md, borderRadius: tokens.radius.md, border: `1px solid ${theme.border}` }} />
        {message ? <p style={{ margin: 0 }}>{message}</p> : null}
        {error ? <p style={{ color: tokens.color.danger, margin: 0 }}>{error}</p> : null}
        <button style={{ border: "none", borderRadius: tokens.radius.md, padding: tokens.spacing.md, background: tokens.color.primary, color: tokens.color.primaryText }}>
          {resetPassword.isPending ? "..." : "Actualizar"}
        </button>
        <Link href="/login">Volver al login</Link>
      </form>
    </main>
  );
}
