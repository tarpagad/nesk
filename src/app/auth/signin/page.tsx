"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setSuccess(
        "Password reset successful! You can now sign in with your new password.",
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn.email({
        email,
        password,
      });

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password",
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
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
            Sign in to NESK Help Desk
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
              {success}
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
              className="block bg-white dark:bg-gray-900 shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block bg-white dark:bg-gray-900 shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full text-gray-900 dark:text-gray-100"
            />
            <div className="mt-2 text-right">
              <a
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full font-medium text-white text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
