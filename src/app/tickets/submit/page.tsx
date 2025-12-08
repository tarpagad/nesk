"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createTicket,
  getCategories,
  getPriorities,
} from "@/app/actions/tickets";
import { useSession } from "@/lib/auth-client";
import type { Category, Priority } from "@/types";

const REDIRECT_DELAY_MS = 2000;

export default function SubmitTicketPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (categoryId) formData.append("categoryId", categoryId);
    if (priorityId) formData.append("priorityId", priorityId);

    try {
      const result = await createTicket(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        setSubject("");
        setMessage("");
        setCategoryId("");
        setPriorityId("");

        // Redirect to ticket status page after delay
        setTimeout(() => {
          router.push(`/tickets/status?id=${result.ticketId}`);
        }, REDIRECT_DELAY_MS);
      }
    } catch (_err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="bg-yellow-50 shadow p-6 border border-yellow-200 rounded-lg text-center">
            <h2 className="mb-4 font-semibold text-2xl text-yellow-800">
              Sign In Required
            </h2>
            <p className="mb-6 text-yellow-700">
              You need to be signed in to submit a ticket.
            </p>
            <a
              href="/auth/signin"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium text-white"
            >
              Sign In
            </a>
            <span className="mx-4 text-gray-500">or</span>
            <a
              href="/auth/signup"
              className="inline-block bg-green-600 hover:bg-green-700 px-6 py-2 rounded-md font-medium text-white"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-gray-900">
            Submit Support Ticket
          </h1>
          <p className="mt-2 text-gray-600">
            Describe your issue and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && (
              <div className="bg-red-50 px-4 py-3 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 px-4 py-3 border border-green-200 rounded text-green-700">
                Ticket submitted successfully! Redirecting to ticket status...
              </div>
            )}

            <div>
              <label
                htmlFor="subject"
                className="block font-medium text-gray-700 text-sm"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block font-medium text-gray-700 text-sm"
              >
                Category
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              >
                <option value="">Select a category (optional)</option>
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
                className="block font-medium text-gray-700 text-sm"
              >
                Priority
              </label>
              <select
                id="priority"
                value={priorityId}
                onChange={(e) => setPriorityId(e.target.value)}
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              >
                <option value="">Select priority (optional)</option>
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
                className="block font-medium text-gray-700 text-sm"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide as much detail as possible about your issue..."
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-white"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
              <a
                href="/"
                className="flex-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-center text-gray-700"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>

        <div className="bg-blue-50 shadow mt-6 p-4 border border-blue-200 rounded-lg">
          <h3 className="mb-2 font-semibold text-blue-900">
            Before submitting:
          </h3>
          <ul className="space-y-1 text-blue-800 text-sm list-disc list-inside">
            <li>Check the Knowledge Base for solutions to common issues</li>
            <li>Provide clear and detailed information about your problem</li>
            <li>Include any error messages or screenshots if applicable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
