"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPasswordWithToken } from "@/app/actions/password-reset";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Invalid or missing reset token");
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordWithToken(token, password);

      // Success - redirect to signin with success message
      router.push("/auth/signin?reset=success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again or request a new reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="space-y-8 bg-white shadow p-8 rounded-lg w-full max-w-md">
          <div>
            <h2 className="font-bold text-3xl text-center">Invalid Link</h2>
            <p className="mt-2 text-gray-600 text-center">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen">
      <div className="space-y-8 bg-white shadow p-8 rounded-lg w-full max-w-md">
        <div>
          <h2 className="font-bold text-3xl text-center">Set New Password</h2>
          <p className="mt-2 text-gray-600 text-center">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 px-4 py-3 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 text-sm"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              placeholder="Minimum 8 characters"
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700 text-sm"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              placeholder="Re-enter your password"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full font-medium text-white text-sm"
          >
            {loading ? "Resetting password..." : "Reset Password"}
          </button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 text-sm"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
