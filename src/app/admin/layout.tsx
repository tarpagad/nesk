import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if user is authenticated and is admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/team", label: "Team" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/email-templates", label: "Email Templates" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/reports", label: "Reports" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-white border-gray-200 border-r w-64 min-h-screen">
          <div className="p-6">
            <h1 className="font-bold text-gray-900 text-2xl">Admin Panel</h1>
            <p className="mt-1 text-gray-600 text-sm">{session.user.email}</p>
          </div>
          <nav className="space-y-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block hover:bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-gray-900 text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/staff"
              className="block hover:bg-gray-100 mt-4 px-4 py-2 rounded-lg font-medium text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              ← Back to Staff Portal
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
