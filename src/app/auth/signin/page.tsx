"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";

function createCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2; // 2-9
  const b = Math.floor(Math.random() * 8) + 2; // 2-9
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
  };
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(createCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setSuccess(t("auth.signin.successReset"));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (Number(captchaInput) !== captcha.answer) {
      setError(t("auth.signin.errorCaptcha"));
      setCaptcha(createCaptcha());
      setCaptchaInput("");
      return;
    }

    setLoading(true);

    try {
      await signIn.email({
        email,
        password,
      });

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("auth.signin.errorInvalid"),
      );
      setCaptcha(createCaptcha());
      setCaptchaInput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
      <div className="space-y-8 bg-white dark:bg-gray-800 shadow p-8 border dark:border-gray-700 rounded-lg w-full max-w-md">
        <div>
          <h2 className="font-bold dark:text-gray-100 text-3xl text-center">
            {t("auth.signin.title")}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
            {t("auth.signin.subtitle")}
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
              {t("auth.signin.email")}
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
              {t("auth.signin.password")}
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
                {t("auth.signin.forgot")}
              </a>
            </div>
          </div>

          <div>
            <label
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
              htmlFor="captcha"
            >
              {t("auth.signin.antiBot")}
            </label>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                {captcha.question}
              </span>
              <input
                id="captcha"
                type="number"
                inputMode="numeric"
                required
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-32"
                placeholder={t("auth.signin.captchaPlaceholder")}
              />
              <button
                type="button"
                onClick={() => {
                  setCaptcha(createCaptcha());
                  setCaptchaInput("");
                }}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-xs"
              >
                {t("auth.signin.captchaRefresh")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full font-medium text-white text-sm"
          >
            {loading ? t("auth.signin.submitting") : t("auth.signin.submit")}
          </button>

          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
            {t("auth.signin.footer")}{" "}
            <a
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              {t("auth.signin.footerLink")}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center bg-white dark:bg-gray-900 min-h-screen">
          <div className="text-gray-600 dark:text-gray-300">
            {t("auth.signin.loading")}
          </div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
