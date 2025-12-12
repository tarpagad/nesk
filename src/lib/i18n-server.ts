import { cookies } from "next/headers";

type Locale = "en" | "ar" | "es" | "fr";

type Dictionary = Record<string, any>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/locales/en.json").then((m) => m.default),
  ar: () => import("@/locales/ar.json").then((m) => m.default),
  es: () => import("@/locales/es.json").then((m) => m.default),
  fr: () => import("@/locales/fr.json").then((m) => m.default),
};

export const supportedLocales: Locale[] = ["en", "ar", "es", "fr"];
export const fallbackLocale: Locale = "en";
const localeCookieName = "NEXT_LOCALE";

export async function getDictionary(locale: string): Promise<Dictionary> {
  const normalized = normalizeLocale(locale);
  const loader = dictionaries[normalized];
  return loader ? loader() : dictionaries[fallbackLocale]();
}

export function normalizeLocale(locale: string): Locale {
  const lower = locale.toLowerCase();
  if (supportedLocales.includes(lower as Locale)) {
    return lower as Locale;
  }
  if (lower.startsWith("en")) return "en";
  if (lower.startsWith("ar")) return "ar";
  if (lower.startsWith("es")) return "es";
  if (lower.startsWith("fr")) return "fr";
  return fallbackLocale;
}

export async function getRequestedLocale(
  cookieStore?: Awaited<ReturnType<typeof cookies>>,
): Promise<Locale> {
  const store = cookieStore ?? (await cookies());
  const cookieLocale = store.get(localeCookieName)?.value;
  if (cookieLocale) return normalizeLocale(cookieLocale);
  const header = store.get("accept-language")?.value || "";
  const preferred = header.split(",")[0] ?? fallbackLocale;
  return normalizeLocale(preferred);
}

export type { Locale, Dictionary };
