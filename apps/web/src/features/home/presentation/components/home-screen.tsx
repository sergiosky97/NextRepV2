"use client";

import { IconKey } from "@nextrep/assets/index";
import { WebIcon } from "@nextrep/assets/icons/web-icon";
import { createTheme, tokens } from "@nextrep/ui/index";
import { useRouter } from "next/navigation";
import { useI18n } from "../../../../providers/i18n-provider";
import { useLogout } from "../../../auth/application/use-logout";
import { useRequireAuth } from "../../../auth/application/use-require-auth";
import { useAuthStore } from "../../../auth/application/auth.store";
import { authApiRepository } from "../../../auth/infrastructure/auth-api.repository";

const navItems: { key: IconKey; labelKey: string }[] = [
  { key: "home", labelKey: "home.navHome" },
  { key: "groups", labelKey: "home.navGroups" },
  { key: "activity", labelKey: "home.navActivity" },
  { key: "calendar", labelKey: "home.navCalendar" },
  { key: "more", labelKey: "home.navMore" }
] as const;

export function HomeScreen() {
  const { t } = useI18n();
  const router = useRouter();
  useRequireAuth();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useLogout();
  const mode = session?.user.themeMode ?? "light";
  const theme = createTheme(mode);

  async function toggleTheme() {
    if (!session?.accessToken) return;
    const nextMode = mode === "light" ? "dark" : "light";
    const user = await authApiRepository.updatePreferences(session.accessToken, {
      themeMode: nextMode
    });
    setSession({ ...session, user, accessToken: session.accessToken, refreshToken: session.refreshToken });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.background,
        color: theme.text,
        display: "grid",
        gridTemplateRows: "auto 1fr auto"
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          padding: tokens.spacing.lg,
          display: "flex",
          justifyContent: "space-between",
          gap: tokens.spacing.md,
          alignItems: "center"
        }}
      >
        <div style={{ display: "flex", gap: tokens.spacing.md, alignItems: "center" }}>
          <button
            onClick={() => router.push("/settings")}
            style={{
              width: 42,
              height: 42,
              border: "none",
              borderRadius: tokens.radius.pill,
              background: tokens.color.primary,
              color: tokens.color.primaryText,
              display: "grid",
              placeItems: "center",
              cursor: "pointer"
            }}
          >
            {session?.user.displayName?.slice(0, 1) ?? "U"}
          </button>
          <div style={{ display: "grid", gap: tokens.spacing.xs }}>
            <strong>{session?.user.displayName ?? t("home.greeting")}</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: tokens.spacing.sm, alignItems: "center" }}>
          <button
            onClick={toggleTheme}
            title="Cambiar tema"
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: tokens.radius.pill,
              background: "transparent",
              padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`
            }}
          >
            {mode === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => logout.mutate()}
            style={{
              width: "fit-content",
              border: `1px solid ${theme.border}`,
              borderRadius: tokens.radius.md,
              background: "transparent",
              padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section style={{ overflowY: "auto", padding: tokens.spacing.lg }}>
        <div
          style={{
            border: `1px solid ${theme.border}`,
            borderRadius: tokens.radius.lg,
            background: theme.surface,
            padding: tokens.spacing.xl
          }}
        >
          {t("home.placeholderPost")}
        </div>
      </section>

      <nav
        style={{
          position: "sticky",
          bottom: 0,
          borderTop: `1px solid ${theme.border}`,
          background: theme.surface,
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))"
        }}
      >
        {navItems.map((item, index) => (
          <button
            key={item.key}
            style={{
              border: "none",
              background: "transparent",
              padding: tokens.spacing.md,
              display: "grid",
              gap: tokens.spacing.xs,
              placeItems: "center",
              color: index === 0 ? tokens.color.primary : theme.text
            }}
          >
            <span style={{ display: "grid", placeItems: "center" }}>
              <WebIcon name={item.key} />
            </span>
            <small>{t(item.labelKey)}</small>
          </button>
        ))}
      </nav>
    </main>
  );
}
