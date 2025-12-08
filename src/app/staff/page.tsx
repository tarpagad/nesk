import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getTicketStats() {
  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "open" } }),
    prisma.ticket.count({ where: { status: "in_progress" } }),
    prisma.ticket.count({ where: { status: "resolved" } }),
    prisma.ticket.count({ where: { status: "closed" } }),
  ]);

  return {
    total: totalTickets,
    open: openTickets,
    inProgress: inProgressTickets,
    resolved: resolvedTickets,
    closed: closedTickets,
  };
}

async function getRecentTickets() {
  return await prisma.ticket.findMany({
    take: 10,
    orderBy: { lastUpdate: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
      priority: {
        select: {
          name: true,
        },
      },
    },
  });
}

export default async function StaffDashboard() {
  const stats = await getTicketStats();
  const recentTickets = await getRecentTickets();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Overview of support tickets and system status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
          <div className="font-medium text-gray-600 dark:text-gray-400 text-sm">
            Total Tickets
          </div>
          <div className="mt-2 font-bold text-gray-900 dark:text-gray-100 text-3xl">
            {stats.total}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
          <div className="font-medium text-gray-600 dark:text-gray-400 text-sm">
            Open
          </div>
          <div className="mt-2 font-bold text-orange-600 dark:text-orange-500 text-3xl">
            {stats.open}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
          <div className="font-medium text-gray-600 dark:text-gray-400 text-sm">
            In Progress
          </div>
          <div className="mt-2 font-bold text-blue-600 dark:text-blue-500 text-3xl">
            {stats.inProgress}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
          <div className="font-medium text-gray-600 dark:text-gray-400 text-sm">
            Resolved
          </div>
          <div className="mt-2 font-bold text-green-600 dark:text-green-500 text-3xl">
            {stats.resolved}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-6 rounded-lg">
          <div className="font-medium text-gray-600 dark:text-gray-400 text-sm">
            Closed
          </div>
          <div className="mt-2 font-bold text-gray-600 dark:text-gray-400 text-3xl">
            {stats.closed}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-lg">
        <div className="px-6 py-4 border-gray-200 dark:border-gray-700 border-b">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            Recent Tickets
          </h2>
        </div>
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
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 text-sm whitespace-nowrap">
                    <Link href={`/staff/tickets/${ticket.id}`}>
                      {ticket.id.substring(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100 text-sm">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                    {ticket.user.name || ticket.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === "open"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          : ticket.status === "in_progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : ticket.status === "resolved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                    {ticket.priority?.name || "None"}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                    {new Date(ticket.lastUpdate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentTickets.length === 0 && (
          <div className="px-6 py-12 text-gray-500 dark:text-gray-400 text-center">
            No tickets found
          </div>
        )}

        {recentTickets.length > 0 && (
          <div className="px-6 py-4 border-gray-200 dark:border-gray-700 border-t">
            <Link
              href="/staff/tickets"
              className="font-medium text-blue-600 hover:text-blue-500 dark:hover:text-blue-300 dark:text-blue-400 text-sm"
            >
              View all tickets →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
