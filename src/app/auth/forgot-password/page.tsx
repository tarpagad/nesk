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
    <div className="flex justify-center items-center bg-gray-50 min-h-screen">
      <div className="space-y-8 bg-white shadow p-8 rounded-lg w-full max-w-md">
        <div>
          <h2 className="font-bold text-3xl text-center">Reset Password</h2>
          <p className="mt-2 text-gray-600 text-center">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 px-4 py-3 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 px-4 py-3 border border-green-200 rounded text-green-700">
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
              className="block font-medium text-gray-700 text-sm"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full font-medium text-white text-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="flex justify-center gap-4 text-gray-600 text-sm">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to sign in
            </Link>
            <span>•</span>
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
