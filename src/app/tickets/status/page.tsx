"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getTicketStatus } from "@/app/actions/tickets";

function TicketStatusContent() {
  const searchParams = useSearchParams();
  const ticketIdFromUrl = searchParams.get("id");

  const [ticketId, setTicketId] = useState(ticketIdFromUrl || "");
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState<any>(null);
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
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "waiting for customer":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-gray-900">
            Check Ticket Status
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your ticket ID and email address to view your ticket status.
          </p>
        </div>

        <div className="bg-white shadow mb-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && (
              <div className="bg-red-50 px-4 py-3 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="ticketId"
                className="block font-medium text-gray-700 text-sm"
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
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700 text-sm"
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
                className="block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-blue-500 w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-sm px-6 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full font-medium text-white"
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </form>
        </div>

        {ticket && (
          <div className="bg-white shadow rounded-lg">
            <div className="border-gray-200 px-6 py-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-2xl text-gray-900">
                    {ticket.subject}
                  </h2>
                  <p className="mt-1 text-gray-500 text-sm">
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
                  <p className="font-medium text-gray-500 text-sm">
                    Created By
                  </p>
                  <p className="mt-1 text-gray-900">{ticket.user.name}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 text-sm">
                    Created On
                  </p>
                  <p className="mt-1 text-gray-900">
                    {formatDate(ticket.openDate)}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 text-sm">Category</p>
                  <p className="mt-1 text-gray-900">
                    {ticket.category?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 text-sm">Priority</p>
                  <p className="mt-1 text-gray-900">
                    {ticket.priority?.name || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="border-gray-200 pt-6 border-t">
                <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                  Conversation
                </h3>
                <div className="space-y-4">
                  {ticket.replies.map((reply: any) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-lg ${
                        reply.authorType === "customer"
                          ? "bg-blue-50 border border-blue-100"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">
                          {reply.authorType === "customer"
                            ? "You"
                            : "Support Team"}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-gray-200 border-t rounded-b-lg">
              <p className="text-gray-600 text-sm">
                Last updated: {formatDate(ticket.lastUpdate)}
              </p>
            </div>
          </div>
        )}

        {!ticket && !error && (
          <div className="bg-blue-50 shadow p-6 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800">
              Enter your ticket ID and email above to view your ticket status.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <TicketStatusContent />
    </Suspense>
  );
}
