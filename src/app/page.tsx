import Link from "next/link";
import { Navbar } from "./Navbar";

export default function Home() {
  return (
    <div className="bg-linear-to-br from-blue-50 dark:from-gray-900 to-indigo-100 dark:to-gray-800 min-h-screen">
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-gray-100 text-5xl">
            Welcome to NESK Help Desk
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600 dark:text-gray-300 text-xl">
            A modern, full-featured ticketing system built with Next.js 16,
            Prisma, and Better-Auth
          </p>

          <div className="gap-8 grid md:grid-cols-3 mt-16">
            <Link
              href="/tickets/submit"
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-8 border dark:border-gray-700 rounded-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">🎫</div>
              <h3 className="mb-2 font-semibold dark:text-gray-100 text-xl">
                Submit Tickets
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Easy ticket submission with real-time status tracking
              </p>
            </Link>

            <Link
              href="/kb"
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-8 border dark:border-gray-700 rounded-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="mb-2 font-semibold dark:text-gray-100 text-xl">
                Knowledge Base
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Search and browse helpful articles and documentation
              </p>
            </Link>

            <Link
              href="/tickets/status"
              className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg p-8 border dark:border-gray-700 rounded-lg transition-shadow"
            >
              <div className="mb-4 text-4xl">🔍</div>
              <h3 className="mb-2 font-semibold dark:text-gray-100 text-xl">
                Track Ticket
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check the status of your existing support tickets
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
