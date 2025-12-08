"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getTicketStatus } from "@/app/actions/tickets";
import { Navbar } from "@/app/Navbar";
import RichTextDisplay from "@/components/RichTextDisplay";

function TicketStatusContent() {
  const searchParams = useSearchParams();
  const ticketIdFromUrl = searchParams.get("id");

  const [ticketId, setTicketId] = useState(ticketIdFromUrl || "");
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState<
    Awaited<ReturnType<typeof getTicketStatus>>["ticket"] | null
  >(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-load if ticket ID is in URL
  useEffect(() => {
    if (ticketIdFromUrl) {
      setTicketId(ticketIdFromUrl);
    }
  }, [ticketIdFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTicket(null);
    setLoading(true);

    try {
      const result = await getTicketStatus(ticketId.trim(), email.trim());

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setTicket(result.ticket);
      }
    } catch (_err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:text-blue-400";
      case "in progress":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "waiting for customer":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      case "resolved":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400";
      case "closed":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-900 py-12 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
              Check Ticket Status
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your ticket ID and email address to view your ticket status.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 mb-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border border-red-200 rounded text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="ticketId"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  Ticket ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="ticketId"
                  type="text"
                  required
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter your ticket ID"
                  className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700 dark:text-gray-300 text-sm"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email used when submitting the ticket"
                  className="block shadow-sm dark:shadow-gray-900 mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm dark:shadow-gray-900 px-6 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full font-medium text-white"
              >
                {loading ? "Checking..." : "Check Status"}
              </button>
            </form>
          </div>

          {ticket && (
            <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-lg">
              <div className="px-6 py-4 border-gray-200 dark:border-gray-700 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-2xl">
                      {ticket.subject}
                    </h2>
                    <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                      Ticket ID: {ticket.id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-medium text-sm ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="gap-6 grid grid-cols-2 md:grid-cols-4 mb-6">
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                      Created By
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {ticket.user.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                      Created On
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {formatDate(ticket.openDate)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                      Category
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {ticket.category?.name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                      Priority
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {ticket.priority?.name || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-gray-200 dark:border-gray-700 border-t">
                  <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    Conversation
                  </h3>
                  <div className="space-y-4">
                    {ticket.replies.map((reply: any) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-lg ${
                          reply.authorType === "customer"
                            ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800"
                            : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {reply.authorType === "customer"
                              ? "You"
                              : "Support Team"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <RichTextDisplay content={reply.message} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 px-6 py-4 border-gray-200 dark:border-gray-700 border-t rounded-b-lg">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Last updated: {formatDate(ticket.lastUpdate)}
                </p>
              </div>
            </div>
          )}

          {!ticket && !error && (
            <div className="bg-blue-50 dark:bg-blue-900/30 shadow dark:shadow-gray-900 p-6 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
              <p className="text-blue-800 dark:text-blue-400">
                Enter your ticket ID and email above to view your ticket status.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function TicketStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <TicketStatusContent />
    </Suspense>
  );
}
