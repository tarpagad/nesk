"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/password-reset";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await requestPasswordReset(email);

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
      <div className="space-y-8 bg-white dark:bg-gray-800 shadow p-8 border dark:border-gray-700 rounded-lg w-full max-w-md">
        <div>
          <h2 className="font-bold dark:text-gray-100 text-3xl text-center">
            Reset Password
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400">
              <p className="font-medium">Password reset email sent!</p>
              <p className="mt-1 text-sm">
                Check the terminal/console for the reset link (development
                mode).
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full font-medium text-white text-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="flex justify-center gap-4 text-gray-600 dark:text-gray-300 text-sm">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              Back to sign in
            </Link>
            <span>•</span>
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
