"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { setLocaleCookie, supportedLocales, useI18n } from "@/lib/i18n";

type LanguageSwitcherProps = {
  compact?: boolean;
  iconOnly?: boolean;
};

export function LanguageSwitcher({
  compact = false,
  iconOnly = false,
}: LanguageSwitcherProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (nextLocale: string) => {
    startTransition(() => {
      setLocaleCookie(nextLocale as any);
      router.refresh();
    });
  };

  const cycleToNextLocale = () => {
    const idx = supportedLocales.indexOf(locale);
    const next = supportedLocales[(idx + 1) % supportedLocales.length];
    handleChange(next);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (iconOnly) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={
            t("common.language") + ": " + t(`common.localeLabel.${locale}`)
          }
          title={
            t("common.language") + ": " + t(`common.localeLabel.${locale}`)
          }
          disabled={pending}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md w-9 h-9 text-gray-600 dark:text-gray-300"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 0c2.5 2 4 6 4 10s-1.5 8-4 10m0-20c-2.5 2-4 6-4 10s1.5 8 4 10M2 12h20M4 7h16M4 17h16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {open && (
          <div
            role="menu"
            aria-label={t("common.language")}
            className="right-0 z-20 absolute bg-white dark:bg-gray-900 shadow-lg mt-2 border border-gray-200 dark:border-gray-700 rounded-md min-w-[8rem] overflow-hidden"
          >
            {supportedLocales.map((loc) => (
              <button
                key={loc}
                type="button"
                role="menuitemradio"
                aria-checked={locale === loc}
                onClick={() => {
                  handleChange(loc);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-sm ${
                  locale === loc
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span>{t(`common.localeLabel.${loc}`)}</span>
                {locale === loc && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <title>{t(`common.localeLabel.${loc}`)}</title>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <label
      className={`flex items-center ${compact ? "gap-1" : "gap-2"} text-gray-600 dark:text-gray-300 ${compact ? "text-xs" : "text-sm"}`}
    >
      {/* Label hidden in compact mode on small screens */}
      <span className={`${compact ? "hidden sm:inline" : "inline"}`}>
        {t("common.language")}
      </span>
      {/* Globe icon in compact mode (always visible) */}
      {compact && (
        <svg
          className="sm:hidden w-4 sm:w-0 h-4 sm:h-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 0c2.5 2 4 6 4 10s-1.5 8-4 10m0-20c-2.5 2-4 6-4 10s1.5 8 4 10M2 12h20M4 7h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        disabled={pending}
        className={`bg-white dark:bg-gray-900 ${compact ? "h-9 px-2 text-xs" : "h-9 px-2 text-sm"} border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
