import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/Session";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect if not logged in
  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user has staff role
  const isStaff =
    session.user.role === "staff" || session.user.role === "admin";
  const isAdmin = session.user.role === "admin";

  if (!isStaff) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 dark:border-gray-700 border-r w-64 min-h-screen">
          <div className="p-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 text-xl">
              Staff Portal
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              {session.user.name || session.user.email}
            </p>
            {isAdmin && (
              <span className="inline-block bg-blue-100 dark:bg-blue-900/50 mt-2 px-2 py-1 rounded font-semibold text-blue-700 dark:text-blue-300 text-xs">
                Administrator
              </span>
            )}
          </div>

          <nav className="space-y-1 px-4">
            <Link
              href="/staff"
              className="block hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300"
            >
              Dashboard
            </Link>
            <Link
              href="/staff/tickets"
              className="block hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300"
            >
              All Tickets
            </Link>
            <Link
              href="/staff/kb"
              className="block hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300"
            >
              Knowledge Base
            </Link>

            {isAdmin && (
              <>
                <div className="my-4 pt-4 dark:border-gray-700 border-t">
                  <p className="px-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase">
                    Admin
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="block hover:bg-purple-50 dark:hover:bg-purple-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/admin/team"
                  className="block hover:bg-purple-50 dark:hover:bg-purple-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                >
                  Team Management
                </Link>
                <Link
                  href="/admin/categories"
                  className="block hover:bg-purple-50 dark:hover:bg-purple-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/email-templates"
                  className="block hover:bg-purple-50 dark:hover:bg-purple-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                >
                  Email Templates
                </Link>
                <Link
                  href="/admin/settings"
                  className="block hover:bg-purple-50 dark:hover:bg-purple-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                >
                  Settings
                </Link>
                <Link
                  href="/admin/reports"
                  className="block hover:bg-purple-50 dark:hover:bg-purple-900/30 px-4 py-2 rounded-md font-medium text-gray-700 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-300"
                >
                  Reports
                </Link>
              </>
            )}

            <Link
              href="/"
              className="block hover:bg-blue-50 dark:hover:bg-blue-900/30 mt-8 px-4 py-2 pt-4 dark:border-gray-700 border-t rounded-md font-medium text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 dark:text-gray-300"
            >
              ← Back to Portal
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
