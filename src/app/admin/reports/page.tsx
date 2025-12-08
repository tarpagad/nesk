"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getTicketStats } from "@/app/actions/admin";

type DashboardStats = {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalUsers: number;
  totalKbArticles: number;
  publishedKbArticles: number;
  teamMembers: number;
};

type TicketStats = {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  byDate: Record<string, number>;
};

export default function ReportsPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [ticketStats, setTicketStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [days]);

  async function loadData() {
    setLoading(true);
    setError("");

    const [dashResult, ticketResult] = await Promise.all([
      getDashboardStats(),
      getTicketStats(days),
    ]);

    if ("error" in dashResult) {
      setError(dashResult.error || "Failed to load dashboard stats");
    } else {
      setDashboardStats(dashResult.stats);
    }

    if ("error" in ticketResult) {
      setError(ticketResult.error || "Failed to load ticket stats");
    } else {
      setTicketStats(ticketResult.stats);
    }

    setLoading(false);
  }

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Insights into your help desk performance
          </p>
        </div>
        <div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      {dashboardStats && (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Tickets"
            value={dashboardStats.totalTickets}
            color="blue"
          />
          <StatCard
            title="Open Tickets"
            value={dashboardStats.openTickets}
            color="yellow"
          />
          <StatCard
            title="Resolved Tickets"
            value={dashboardStats.resolvedTickets}
            color="green"
          />
          <StatCard
            title="Total Users"
            value={dashboardStats.totalUsers}
            color="purple"
          />
        </div>
      )}

      {/* Ticket Stats */}
      {ticketStats && (
        <div className="space-y-6">
          {/* By Status */}
          <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
              Tickets by Status (Last {days} days)
            </h2>
            <div className="space-y-3">
              {Object.entries(ticketStats.byStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
                      {status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 rounded-full w-64 h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2"
                        style={{
                          width: `${(count / ticketStats.total) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 font-semibold text-gray-900 dark:text-gray-100 text-sm text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Priority */}
          <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
              Tickets by Priority
            </h2>
            <div className="space-y-3">
              {Object.entries(ticketStats.byPriority).map(
                ([priority, count]) => (
                  <div
                    key={priority}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
                        {priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 rounded-full w-64 h-2">
                        <div
                          className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                          style={{
                            width: `${(count / ticketStats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-12 font-semibold text-gray-900 dark:text-gray-100 text-sm text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* By Category */}
          <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
              Tickets by Category
            </h2>
            <div className="space-y-3">
              {Object.entries(ticketStats.byCategory).map(
                ([category, count]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 rounded-full w-64 h-2">
                        <div
                          className="bg-purple-600 rounded-full h-2"
                          style={{
                            width: `${(count / ticketStats.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-12 font-semibold text-gray-900 dark:text-gray-100 text-sm text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
              Ticket Trend
            </h2>
            <div className="space-y-2">
              {Object.entries(ticketStats.byDate)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .slice(-14)
                .map(([date, count]) => (
                  <div key={date} className="flex items-center gap-3">
                    <span className="w-24 text-gray-600 dark:text-gray-400 text-xs">
                      {new Date(date).toLocaleDateString()}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 rounded-full h-2"
                        style={{
                          width: `${(count / Math.max(...Object.values(ticketStats.byDate))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 font-semibold text-gray-900 dark:text-gray-100 text-xs text-right">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="mb-2 font-medium text-gray-600 dark:text-gray-400 text-sm">
                Total in Period
              </h3>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
                {ticketStats.total}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="mb-2 font-medium text-gray-600 dark:text-gray-400 text-sm">
                Avg. per Day
              </h3>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
                {(ticketStats.total / days).toFixed(1)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="mb-2 font-medium text-gray-600 dark:text-gray-400 text-sm">
                Categories
              </h3>
              <p className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
                {Object.keys(ticketStats.byCategory).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
  };

  return (
    <div
      className={`rounded-lg shadow-sm dark:shadow-gray-900 border p-6 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="opacity-80 font-medium text-sm">{title}</h3>
      <p className="mt-2 font-bold text-3xl">{value}</p>
    </div>
  );
}

function getPriorityColor(priority: string): string {
  const lower = priority.toLowerCase();
  if (lower === "critical") return "bg-red-600";
  if (lower === "high") return "bg-orange-600";
  if (lower === "medium") return "bg-yellow-600";
  return "bg-green-600";
}
