import Link from "next/link";
import { getSession } from "@/lib/Session";
import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="font-bold text-blue-600 text-2xl">NESK</h1>
            <span className="ml-2 text-gray-600">Help Desk</span>
          </Link>

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
