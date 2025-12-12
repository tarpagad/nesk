"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleCookie, supportedLocales, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handleChange = (nextLocale: string) => {
    startTransition(() => {
      setLocaleCookie(nextLocale as any);
      router.refresh();
    });
  };

  return (
    <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
      <span>{t("common.language")}</span>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        disabled={pending}
        className="bg-white dark:bg-gray-900 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {supportedLocales.map((loc) => (
          <option key={loc} value={loc}>
            {t(`common.localeLabel.${loc}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
