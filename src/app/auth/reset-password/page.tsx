"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { resetPasswordWithToken } from "@/app/actions/password-reset";
import { useI18n } from "@/lib/i18n";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError(t("auth.reset.errorMissing"));
    }
    setToken(tokenParam);
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(t("auth.reset.errorMissing"));
      return;
    }

    if (password.length < 8) {
      setError(t("auth.reset.errorLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.reset.errorMatch"));
      return;
    }

    setLoading(true);

    try {
      await resetPasswordWithToken(token, password);

      // Success - redirect to signin with success message
      router.push("/auth/signin?reset=success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("auth.reset.errorGeneric"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
        <div className="space-y-8 bg-white dark:bg-gray-800 shadow p-8 border dark:border-gray-700 rounded-lg w-full max-w-md">
          <div>
            <h2 className="font-bold dark:text-gray-100 text-3xl text-center">
              {t("auth.reset.invalidTitle")}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              {t("auth.reset.invalidBody")}
            </p>
          </div>
          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              {t("auth.reset.requestNew")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
      <div className="space-y-8 bg-white dark:bg-gray-800 shadow p-8 border dark:border-gray-700 rounded-lg w-full max-w-md">
        <div>
          <h2 className="font-bold dark:text-gray-100 text-3xl text-center">
            {t("auth.reset.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
            {t("auth.reset.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              {t("auth.reset.newPassword")}
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
              placeholder={t("auth.reset.placeholder")}
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              {t("auth.reset.confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
              placeholder={t("auth.reset.confirmPassword")}
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full font-medium text-white text-sm"
          >
            {loading ? t("auth.reset.submitting") : t("auth.reset.submit")}
          </button>

          <div className="text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              {t("auth.reset.back")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
          <div className="text-gray-600 dark:text-gray-300">
            {t("auth.reset.loading")}
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
