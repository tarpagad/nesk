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
