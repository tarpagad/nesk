import { ProtectedRoute, getSession } from "@/lib/Session";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  const isStaff = session.user.role === "staff" || session.user.role === "admin";
  
  if (!isStaff) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Staff Portal</h2>
            <p className="text-sm text-gray-600 mt-1">
              {session.user.name || session.user.email}
            </p>
          </div>
          
          <nav className="px-4 space-y-1">
            <Link
              href="/staff"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/staff/tickets"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md font-medium"
            >
              All Tickets
            </Link>
            <Link
              href="/staff/kb"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md font-medium"
            >
              Knowledge Base
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md font-medium mt-8 border-t pt-4"
            >
              ← Back to Portal
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
