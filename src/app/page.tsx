import Link from "next/link";
import { Navbar } from "./Navbar";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 dark:from-gray-900 to-indigo-100 dark:to-gray-800 min-h-screen">
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

          <div className="mt-16">
            <h3 className="mb-8 font-bold dark:text-gray-100 text-2xl">
              Getting Started
            </h3>
            <div className="bg-white dark:bg-gray-800 shadow-md mx-auto p-8 border dark:border-gray-700 rounded-lg max-w-3xl text-left">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600 dark:text-blue-400">
                    1.
                  </span>
                  <div className="dark:text-gray-200">
                    <strong>Start Prisma Database:</strong>
                    <code className="block bg-gray-100 dark:bg-gray-900 mt-1 p-2 rounded dark:text-gray-200">
                      bun db:dev
                    </code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600 dark:text-blue-400">
                    2.
                  </span>
                  <div className="dark:text-gray-200">
                    <strong>Push Database Schema:</strong>
                    <code className="block bg-gray-100 dark:bg-gray-900 mt-1 p-2 rounded dark:text-gray-200">
                      bun db:push
                    </code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600 dark:text-blue-400">
                    3.
                  </span>
                  <div className="dark:text-gray-200">
                    <strong>Start Development Server:</strong>
                    <code className="block bg-gray-100 dark:bg-gray-900 mt-1 p-2 rounded dark:text-gray-200">
                      bun dev
                    </code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 font-bold text-blue-600 dark:text-blue-400">
                    4.
                  </span>
                  <div className="dark:text-gray-200">
                    <strong>Create an account and start using NESK!</strong>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
