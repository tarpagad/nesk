"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTicketsForStaff } from "@/app/actions/staff";

export default function StaffTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
  });

  useEffect(() => {
    async function loadTickets() {
      setLoading(true);
      const result = await getTicketsForStaff(filters);
      if (result.success && result.tickets) {
        setTickets(result.tickets);
      }
      setLoading(false);
    }

    loadTickets();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", priority: "", category: "", search: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
            All Tickets
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and respond to support tickets
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 mb-6 p-6 rounded-lg">
        <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search by subject or ID..."
              className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_customer">Waiting for Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md w-full font-medium text-gray-700 dark:text-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-lg overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-gray-500 dark:text-gray-400 text-center">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-6 py-12 text-gray-500 dark:text-gray-400 text-center">
            No tickets found matching your filters
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
              <thead className="bg-white dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Last Update
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">
                      {ticket.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100 text-sm">
                      <Link
                        href={`/staff/tickets/${ticket.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {ticket.subject}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {ticket.user.name || ticket.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === "open"
                            ? "bg-orange-100 text-orange-800"
                            : ticket.status === "in_progress"
                              ? "bg-blue-100 text-blue-800 dark:text-blue-400"
                              : ticket.status === "waiting_customer"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                                : ticket.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {ticket.priority?.name || "None"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {ticket.category?.name || "None"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {new Date(ticket.lastUpdate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-sm whitespace-nowrap">
                      <Link
                        href={`/staff/tickets/${ticket.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
        Showing {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
