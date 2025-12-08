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
import { isRichTextEmpty } from "@/lib/utils";
import RichTextEditor from "@/components/RichTextEditor";
import RichTextDisplay from "@/components/RichTextDisplay";
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
        <div className="text-gray-600">Loading ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || "Ticket not found"}</div>
        <button
          onClick={() => router.push("/staff/tickets")}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to tickets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/staff/tickets")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Back to tickets
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>
        <p className="text-gray-600 mt-1">
          Ticket #{ticket.id.substring(0, 8)}
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Information
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {ticket.user.name || ticket.user.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {ticket.user.email}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(ticket.openDate).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Update
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(ticket.lastUpdate).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Conversation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {reply.authorType === "staff" ? "Staff" : "Customer"}
                      </span>
                      {reply.isInternal && (
                        <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <RichTextDisplay content={reply.message} />
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Internal note (not visible to customer)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-medium"
              >
                {submitting ? "Sending..." : "Send Reply"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_customer">Waiting for Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Priority
            </h3>
            <select
              value={ticket.priorityId || ""}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Category
            </h3>
            <select
              value={ticket.categoryId || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
