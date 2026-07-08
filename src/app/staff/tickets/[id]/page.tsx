"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addTicketReply,
  getTicketForStaff,
  updateTicketCategory,
  updateTicketPriority,
  updateTicketStatus,
} from "@/app/actions/staff";
import { getCategories, getPriorities } from "@/app/actions/tickets";
import RichTextDisplay from "@/components/RichTextDisplay";
import RichTextEditor from "@/components/RichTextEditor";
import { isRichTextEmpty } from "@/lib/utils";
import type { Category, Priority } from "@/types";

export default function StaffTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [ticketResult, categoriesResult, prioritiesResult] =
        await Promise.all([
          getTicketForStaff(ticketId),
          getCategories(),
          getPriorities(),
        ]);

      if (ticketResult.success && ticketResult.ticket) {
        setTicket(ticketResult.ticket);
      } else {
        setError(ticketResult.error || "Failed to load ticket");
      }

      if (categoriesResult.success && categoriesResult.categories) {
        setCategories(categoriesResult.categories);
      }

      if (prioritiesResult.success && prioritiesResult.priorities) {
        setPriorities(prioritiesResult.priorities);
      }

      setLoading(false);
    }

    loadData();
  }, [ticketId]);

  const handleStatusChange = async (newStatus: string) => {
    const result = await updateTicketStatus(ticketId, newStatus);
    if (result.success) {
      setTicket({ ...ticket, status: newStatus });
      setSuccess("Status updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Failed to update status");
    }
  };

  const handlePriorityChange = async (priorityId: string) => {
    const result = await updateTicketPriority(ticketId, priorityId || null);
    if (result.success) {
      const priority = priorities.find((p) => p.id === priorityId);
      setTicket({ ...ticket, priorityId, priority });
      setSuccess("Priority updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Failed to update priority");
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    const result = await updateTicketCategory(ticketId, categoryId || null);
    if (result.success) {
      const category = categories.find((c) => c.id === categoryId);
      setTicket({ ...ticket, categoryId, category });
      setSuccess("Category updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Failed to update category");
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Validate that message is not empty
    if (isRichTextEmpty(replyMessage)) {
      setError("Reply message is required");
      setSubmitting(false);
      return;
    }

    const result = await addTicketReply(ticketId, replyMessage, isInternal);

    if (result.success) {
      setSuccess("Reply added successfully");
      setReplyMessage("");
      // Reload ticket data
      const ticketResult = await getTicketForStaff(ticketId);
      if (ticketResult.success && ticketResult.ticket) {
        setTicket(ticketResult.ticket);
      }
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.error || "Failed to add reply");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">
          Loading ticket...
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-red-600">{error || "Ticket not found"}</div>
        <button
          type="button"
          onClick={() => router.push("/staff/tickets")}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          ← Back to tickets
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/staff/tickets")}
          className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          ← Back to tickets
        </button>
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
          {ticket.subject}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Ticket #{ticket.id.substring(0, 8)}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 mb-4 px-4 py-3 border border-red-200 rounded text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 mb-4 px-4 py-3 border border-green-200 rounded text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Ticket Details */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">
              Ticket Information
            </h2>
            <dl className="gap-4 grid grid-cols-2">
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                  Customer
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100 text-sm">
                  {ticket.user.name || ticket.user.email}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                  Email
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100 text-sm">
                  {ticket.user.email}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                  Created
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100 text-sm">
                  {new Date(ticket.openDate).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                  Last Update
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-gray-100 text-sm">
                  {new Date(ticket.lastUpdate).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Conversation */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">
              Conversation
            </h2>
            <div className="space-y-4">
              {ticket.replies.map((reply: any) => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-lg ${
                    reply.isInternal
                      ? "bg-yellow-50 border border-yellow-200"
                      : reply.authorType === "staff"
                        ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {reply.authorType === "staff" ? "Staff" : "Customer"}
                      </span>
                      {reply.isInternal && (
                        <span className="bg-yellow-200 px-2 py-1 rounded text-yellow-800 dark:text-yellow-400 text-xs">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <RichTextDisplay content={reply.message} />
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">
              Add Reply
            </h2>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <RichTextEditor
                  value={replyMessage}
                  onChange={setReplyMessage}
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 text-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Internal note (not visible to customer)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-md font-medium text-white"
              >
                {submitting ? "Sending..." : "Send Reply"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Status
            </h3>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_customer">Waiting for Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Priority
            </h3>
            <select
              value={ticket.priorityId || ""}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
            >
              <option value="">None</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Category
            </h3>
            <select
              value={ticket.categoryId || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
            >
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
