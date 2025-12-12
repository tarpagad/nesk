"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createTicket,
  getCategories,
  getPriorities,
} from "@/app/actions/tickets";
import { Navbar } from "@/app/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import { useSession } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { isRichTextEmpty } from "@/lib/utils";
import type { Category, Priority } from "@/types";

const REDIRECT_DELAY_MS = 2000;

export default function SubmitTicketPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { t, dictionary } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  useEffect(() => {
    async function loadData() {
      const [categoriesResult, prioritiesResult] = await Promise.all([
        getCategories(),
        getPriorities(),
      ]);

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories || []);
      }

      if (prioritiesResult.success) {
        setPriorities(prioritiesResult.priorities || []);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setEmailWarning(null);
    setLoading(true);

    // Validate that message is not empty
    if (isRichTextEmpty(message)) {
      setError(t("tickets.submit.errorMessageRequired"));
      setLoading(false);
      return;
    }

    if (!session) {
      if (!name.trim()) {
        setError(t("tickets.submit.errorNameRequired"));
        setLoading(false);
        return;
      }

      if (!email.trim()) {
        setError(t("tickets.submit.errorEmailRequired"));
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (categoryId) formData.append("categoryId", categoryId);
    if (priorityId) formData.append("priorityId", priorityId);
    if (!session) {
      formData.append("name", name.trim());
      formData.append("email", email.trim());
    }

    try {
      const result = await createTicket(formData);

      if (result.error) {
        setError(result.error);
        setEmailWarning(result.emailWarning || null);
      } else if (result.success) {
        setSubject("");
        setMessage("");
        setCategoryId("");
        setPriorityId("");
        setSuccess(true);
        setEmailWarning(result.emailWarning || null);

        // Redirect to ticket status page after delay
        setTimeout(() => {
          router.push(`/tickets/status?id=${result.ticketId}`);
        }, REDIRECT_DELAY_MS);
      }
    } catch (_err) {
      setError(t("tickets.submit.errorUnexpected"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-900 py-12 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="mb-8">
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
              {t("tickets.submit.title")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t("tickets.submit.subtitle")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border border-red-200 rounded text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3 border border-green-200 rounded text-green-700 dark:text-green-400">
                  {t("tickets.submit.success")}
                </div>
              )}

              {!session && (
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {t("tickets.submit.name")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("tickets.submit.namePlaceholder")}
                      className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {t("tickets.submit.email")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("tickets.submit.emailPlaceholder")}
                      className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="subject"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t("tickets.submit.subject")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t("tickets.submit.subjectPlaceholder")}
                  className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t("tickets.submit.category")}
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                >
                  <option value="">
                    {t("tickets.submit.categoryPlaceholder")}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t("tickets.submit.priority")}
                </label>
                <select
                  id="priority"
                  value={priorityId}
                  onChange={(e) => setPriorityId(e.target.value)}
                  className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                >
                  <option value="">
                    {t("tickets.submit.priorityPlaceholder")}
                  </option>
                  {priorities.map((pri) => (
                    <option key={pri.id} value={pri.id}>
                      {pri.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  {t("tickets.submit.message")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={message}
                  onChange={setMessage}
                  placeholder={t("tickets.submit.messagePlaceholder")}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm dark:shadow-gray-900 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-white"
                >
                  {loading
                    ? t("tickets.submit.submitting")
                    : t("tickets.submit.submit")}
                </button>
                <a
                  href="/"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-gray-700 dark:text-gray-300 text-center"
                >
                  {t("tickets.submit.cancel")}
                </a>
              </div>
            </form>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 shadow dark:shadow-gray-900 mt-6 p-4 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="mb-2 font-semibold text-blue-900">
              {t("tickets.submit.beforeTitle")}
            </h3>
            <ul className="space-y-1 text-blue-800 dark:text-blue-400 text-sm list-disc list-inside">
              {(dictionary.tickets?.submit?.beforeTips ?? []).map(
                (item: string) => (
                  <li key={item}>{item}</li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
