"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

function createCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2; // 2-9
  const b = Math.floor(Math.random() * 8) + 2; // 2-9
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
  };
}

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(createCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (Number(captchaInput) !== captcha.answer) {
      setError("Captcha incorrect. Please try again.");
      setCaptcha(createCaptcha());
      setCaptchaInput("");
      return;
    }

    setLoading(true);

    try {
      await signUp.email({
        email,
        password,
        name,
      });

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
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
            Create Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
            Sign up for NESK Help Desk
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
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400 rounded-md focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 w-full"
            />
          </div>

          <div>
            <label
              className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
              htmlFor="captcha"
            >
              Anti-bot check
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
                placeholder="Answer"
              />
              <button
                type="button"
                onClick={() => {
                  setCaptcha(createCaptcha());
                  setCaptchaInput("");
                }}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-xs"
              >
                Refresh
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full font-medium text-white text-sm"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
            Already have an account?{" "}
            <a
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
