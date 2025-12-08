import Link from "next/link";
import { getSession } from "@/lib/Session";
import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await getSession();
  const isStaff = session?.user.role === "staff" || session?.user.role === "admin";

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <h1 className="font-bold text-blue-600 text-2xl">NESK</h1>
              <span className="ml-2 text-gray-600">Help Desk</span>
            </Link>
            
            <div className="hidden md:flex gap-6">
              <Link
                href="/kb"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Knowledge Base
              </Link>
              <Link
                href="/tickets/submit"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Submit Ticket
              </Link>
              <Link
                href="/tickets/status"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Track Ticket
              </Link>
              {isStaff && (
                <Link
                  href="/staff"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Staff Portal
                </Link>
              )}
            </div>
          </div>

          {session ? (
            <UserMenu user={session.user} />
          ) : (
            <div className="flex gap-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 font-medium text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
