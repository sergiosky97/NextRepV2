"use client";

import { tokens, createTheme } from "@nextrep/ui/index";
import Link from "next/link";
import { useState } from "react";
import { useForgotPassword } from "../../application/use-forgot-password";

export function ForgotPasswordScreen() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const forgotPassword = useForgotPassword();
  const theme = createTheme("light");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!value.trim()) {
      setError("Indica correo o telefono.");
      return;
    }
    setError("");
    try {
      const response = await forgotPassword.mutateAsync(value.trim());
      setMessage(response.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo iniciar la recuperacion");
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
        <h2 style={{ margin: 0 }}>Recuperar contrasena</h2>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Correo o telefono"
          style={{
            padding: tokens.spacing.md,
            borderRadius: tokens.radius.md,
            border: `1px solid ${theme.border}`
          }}
        />
        {message ? <p style={{ margin: 0 }}>{message}</p> : null}
        {error ? <p style={{ color: tokens.color.danger, margin: 0 }}>{error}</p> : null}
        <button
          style={{
            border: "none",
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md,
            background: tokens.color.primary,
            color: tokens.color.primaryText
          }}
        >
          {forgotPassword.isPending ? "..." : "Enviar"}
        </button>
        <Link href="/reset-password">Ya tengo token</Link>
        <Link href="/login">Volver al login</Link>
      </form>
    </main>
  );
}
