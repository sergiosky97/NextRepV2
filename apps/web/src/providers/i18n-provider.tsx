"use client";

import { createI18n, Locale } from "@nextrep/i18n/index";
import { createContext, ReactNode, useContext, useMemo } from "react";

const I18nContext = createContext(createI18n("es"));

export function I18nProvider({
  children,
  locale = "es"
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const value = useMemo(() => createI18n(locale), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
