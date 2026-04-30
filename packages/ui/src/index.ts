export const tokens = {
  color: {
    primary: "#4f46e5",
    primaryText: "#ffffff",
    lightBg: "#f8fafc",
    darkBg: "#0f172a",
    lightSurface: "#ffffff",
    darkSurface: "#111827",
    lightText: "#0f172a",
    darkText: "#f8fafc",
    borderLight: "#e2e8f0",
    borderDark: "#334155",
    danger: "#dc2626"
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999
  },
  shadow: {
    card: "0 10px 20px rgba(15, 23, 42, 0.1)"
  },
  typography: {
    title: 28,
    subtitle: 18,
    body: 14
  },
  animation: {
    fast: 120,
    normal: 220
  }
} as const;

export type ThemeMode = "light" | "dark";

export function createTheme(mode: ThemeMode) {
  if (mode === "dark") {
    return {
      background: tokens.color.darkBg,
      surface: tokens.color.darkSurface,
      text: tokens.color.darkText,
      border: tokens.color.borderDark
    };
  }
  return {
    background: tokens.color.lightBg,
    surface: tokens.color.lightSurface,
    text: tokens.color.lightText,
    border: tokens.color.borderLight
  };
}
