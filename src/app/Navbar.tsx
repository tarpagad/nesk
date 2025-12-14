"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { data: session } = useSession();
  const isStaff =
    session?.user?.role === "staff" || session?.user?.role === "admin";
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm dark:border-gray-800 border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
            <Link href="/" className="flex items-center">
              <h1 className="font-bold text-blue-600 dark:text-blue-500 text-2xl">
                {t("navbar.brand")}
              </h1>
              <span className="hidden md:block ml-2 text-gray-600 dark:text-gray-300">
                {t("navbar.helpDesk")}
              </span>
            </Link>

            {/* Desktop main links */}
            <div className="hidden md:flex items-center gap-5">
              <Link
                href="/kb"
                className="font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300 text-sm"
              >
                {t("navbar.knowledgeBase")}
              </Link>
              {/* Grouped ticket actions */}
              <div className="flex bg-white/70 dark:bg-gray-900/70 rounded-lg ring-1 ring-gray-300 dark:ring-gray-700 h-9 overflow-hidden">
                <Link
                  href="/tickets/submit"
                  className="inline-flex items-center hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t("navbar.submitTicket")}
                </Link>
                <div className="self-stretch bg-gray-300/80 dark:bg-gray-700/80 w-px" />
                <Link
                  href="/tickets/status"
                  className="inline-flex items-center hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t("navbar.trackTicket")}
                </Link>
              </div>
              {isStaff && (
                <Link
                  href="/staff"
                  className="font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300"
                >
                  {t("navbar.staffPortal")}
                </Link>
              )}
            </div>
          </div>
          {/* Right-side controls */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <LanguageSwitcher iconOnly />
            <ThemeToggle />
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="hidden sm:flex">
                <div className="flex bg-white/70 dark:bg-gray-900/70 rounded-lg ring-1 ring-gray-300 dark:ring-gray-700 h-9 overflow-hidden">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-3 font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300 text-sm"
                  >
                    {t("navbar.signIn")}
                  </Link>
                  <div className="self-stretch bg-gray-300/80 dark:bg-gray-700/80 w-px" />
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 font-medium text-white text-sm"
                  >
                    {t("navbar.signUp")}
                  </Link>
                </div>
              </div>
            )}
            <Link
              href="https://github.com/tarpagad/nesk"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 font-medium text-gray-700 hover:text-gray-900 dark:hover:text-white dark:text-gray-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              {t("navbar.github")}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={
                mobileOpen ? t("navbar.closeMenu") : t("navbar.openMenu")
              }
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md text-gray-700 dark:text-gray-300"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {/* Hamburger / Close icon */}
              {mobileOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                  <title>{t("navbar.closeMenu")}</title>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <title>{t("navbar.openMenu")}</title>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={`${mobileOpen ? "block" : "hidden"} md:hidden border-t dark:border-gray-800`}
        >
          <div className="space-y-2 py-3">
            <Link
              href="/kb"
              className="block hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded-md text-gray-700 dark:text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              {t("navbar.knowledgeBase")}
            </Link>
            {/* Mobile grouped ticket actions */}
            <div className="flex rounded-lg ring-1 ring-gray-300 dark:ring-gray-700 overflow-hidden">
              <Link
                href="/tickets/submit"
                className="flex-1 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 text-sm text-center"
                onClick={() => setMobileOpen(false)}
              >
                {t("navbar.submitTicket")}
              </Link>
              <div className="self-stretch bg-gray-300/80 dark:bg-gray-700/80 w-px" />
              <Link
                href="/tickets/status"
                className="flex-1 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 text-sm text-center"
                onClick={() => setMobileOpen(false)}
              >
                {t("navbar.trackTicket")}
              </Link>
            </div>
            {isStaff && (
              <Link
                href="/staff"
                className="block hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 rounded-md text-gray-700 dark:text-gray-300"
                onClick={() => setMobileOpen(false)}
              >
                {t("navbar.staffPortal")}
              </Link>
            )}

            {!session && (
              <div className="mt-2">
                <div className="flex rounded-lg ring-1 ring-gray-300 dark:ring-gray-700 overflow-hidden">
                  <Link
                    href="/auth/signin"
                    className="flex-1 px-3 py-2 font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300 text-sm text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("navbar.signIn")}
                  </Link>
                  <div className="self-stretch bg-gray-300/80 dark:bg-gray-700/80 w-px" />
                  <Link
                    href="/auth/signup"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 py-2 font-medium text-white text-sm text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("navbar.signUp")}
                  </Link>
                </div>
              </div>
            )}

            <Link
              href="https://github.com/tarpagad/nesk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 mt-2 px-2 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              {t("navbar.github")}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
