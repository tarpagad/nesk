"use client";

import { createContext, useContext } from "react";

type Locale = "en" | "ar" | "es" | "fr";
type Dictionary = Record<string, any>;

type I18nContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const localeCookieName = "NEXT_LOCALE";
export const supportedLocales: Locale[] = ["en", "ar", "es", "fr"];

export function setLocaleCookie(locale: Locale) {
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=${365 * 24 * 60 * 60}`;
}

function translate(
  dictionary: Dictionary,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const value = key
    .split(".")
    .reduce<any>((acc, part) => (acc ? acc[part] : undefined), dictionary);
  if (typeof value !== "string") return key;
  if (!vars) return value;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`{{${k}}}`, "g"), String(v)),
    value,
  );
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(dictionary, key, vars);
  return (
    <I18nContext.Provider value={{ locale, dictionary, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
