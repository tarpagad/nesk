import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSession } from "@/lib/Session";
import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await getSession();
  const isStaff =
    session?.user.role === "staff" || session?.user.role === "admin";

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm dark:border-gray-800 border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <h1 className="font-bold text-blue-600 dark:text-blue-500 text-2xl">
                NESK
              </h1>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Help Desk
              </span>
            </Link>

            <div className="hidden md:flex gap-6">
              <Link
                href="/kb"
                className="font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300"
              >
                Knowledge Base
              </Link>
              <Link
                href="/tickets/submit"
                className="font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300"
              >
                Submit Ticket
              </Link>
              <Link
                href="/tickets/status"
                className="font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300"
              >
                Track Ticket
              </Link>
              {isStaff && (
                <Link
                  href="/staff"
                  className="font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300"
                >
                  Staff Portal
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-500 dark:text-gray-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
