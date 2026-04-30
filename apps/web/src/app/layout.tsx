import type { Metadata } from "next";
import { createTheme } from "@nextrep/ui/index";
import { ReactNode } from "react";
import { AppProviders } from "../providers/app-providers";

export const metadata: Metadata = {
  title: "NextRep",
  description: "Base architecture web app"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const theme = createTheme("light");
  return (
    <html lang="es">
      <body style={{ margin: 0, background: theme.background, color: theme.text }}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
