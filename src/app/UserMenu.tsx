"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth-client";

interface UserMenuProps {
  user: {
    email: string;
    name?: string | null;
    role?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-md text-gray-700 dark:text-gray-300"
      >
        <div className="flex justify-center items-center bg-blue-600 dark:bg-blue-500 rounded-full w-8 h-8 text-white">
          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
        </div>
        <span className="font-medium">{user.name || user.email}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
          <title>Toggle menu</title>
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="z-10 fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          />
          <div className="right-0 z-20 absolute bg-white dark:bg-gray-800 ring-opacity-5 dark:ring-gray-700 shadow-lg dark:shadow-gray-900 mt-2 rounded-md ring-1 ring-black dark:ring-gray-700 w-56">
            <div className="p-2">
              <div className="px-3 py-2 border-gray-100 dark:border-gray-700 border-b">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {user.name || "User"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {user.email}
                </p>
                {user.role && (
                  <p className="mt-1 font-medium text-blue-600 dark:text-blue-400 text-xs">
                    Role: {user.role}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="hover:bg-red-50 dark:hover:bg-red-900/30 mt-1 px-3 py-2 rounded-md w-full text-red-600 dark:text-red-400 text-sm text-left"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
