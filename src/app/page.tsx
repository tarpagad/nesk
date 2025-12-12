import Link from "next/link";
import { getDictionary, getRequestedLocale } from "@/lib/i18n-server";
import { Navbar } from "./Navbar";

export default async function Home() {
  const locale = await getRequestedLocale();
  const t = (await getDictionary(locale)).home;

  return (
    <div className="bg-linear-to-br from-blue-50 dark:from-gray-900 to-indigo-100 dark:to-gray-800 min-h-screen">
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-gray-100 text-5xl">
            {t.heroTitle}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600 dark:text-gray-300 text-xl">
            {t.heroSubtitle}
          </p>

          <div className="gap-8 grid md:grid-cols-3 mt-16">
            <Link
              href="/tickets/submit"
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-8 border dark:border-gray-700 rounded-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">🎫</div>
              <h3 className="mb-2 font-semibold dark:text-gray-100 text-xl">
                {t.submitTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t.submitSubtitle}
              </p>
            </Link>

            <Link
              href="/kb"
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-8 border dark:border-gray-700 rounded-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="mb-2 font-semibold dark:text-gray-100 text-xl">
                {t.kbTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{t.kbSubtitle}</p>
            </Link>

            <Link
              href="/tickets/status"
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-8 border dark:border-gray-700 rounded-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 font-semibold dark:text-gray-100 text-xl">
                {t.trackTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t.trackSubtitle}
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
