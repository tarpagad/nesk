import Link from "next/link";
import { getActivityLogs, getDashboardStats } from "@/app/actions/admin";

export default async function AdminDashboard() {
  const statsResult = await getDashboardStats();
  const logsResult = await getActivityLogs(10);

  if ("error" in statsResult) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading dashboard: {statsResult.error}
      </div>
    );
  }

  const { stats } = statsResult;
  const logs = "logs" in logsResult ? logsResult.logs : undefined;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Overview of your help desk system</p>
      </div>

      {/* Stats Grid */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          subtitle={`${stats.openTickets} open`}
          link="/staff/tickets"
        />
        <StatCard
          title="Resolved Tickets"
          value={stats.resolvedTickets}
          subtitle={`${Math.round((stats.resolvedTickets / (stats.totalTickets || 1)) * 100)}% resolution rate`}
        />
        <StatCard
          title="KB Articles"
          value={stats.totalKbArticles}
          subtitle={`${stats.publishedKbArticles} published`}
          link="/staff/kb"
        />
        <StatCard
          title="Team Members"
          value={stats.teamMembers}
          subtitle="Active staff"
          link="/admin/team"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Registered customers"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          subtitle="Need attention"
          link="/staff/tickets?status=open"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
          Quick Actions
        </h2>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
          <Link
            href="/admin/team"
            className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Manage Team</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              Add or remove team members
            </p>
          </Link>
          <Link
            href="/admin/categories"
            className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Manage Categories</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              Organize tickets and articles
            </p>
          </Link>
          <Link
            href="/admin/email-templates"
            className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Templates</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              Customize email notifications
            </p>
          </Link>
          <Link
            href="/admin/settings"
            className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">System Settings</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
              Configure system preferences
            </p>
          </Link>
          <Link
            href="/admin/reports"
            className="hover:bg-gray-50 dark:hover:bg-gray-700 p-4 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
          >
            <h3 className="font-medium text-gray-900 dark:text-gray-100">View Reports</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">Analytics and insights</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
          Recent Activity
        </h2>
        {!logs || logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 pb-3 border-gray-100 dark:border-gray-700 last:border-0 border-b text-sm"
              >
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100">
                    {log.action} {log.entityType}
                  </p>
                  {log.details && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400 text-xs">{log.details}</p>
                  )}
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  link,
}: {
  title: string;
  value: number;
  subtitle: string;
  link?: string;
}) {
  const content = (
    <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 className="font-medium text-gray-600 dark:text-gray-400 text-sm">{title}</h3>
      <p className="mt-2 font-bold text-gray-900 dark:text-gray-100 text-3xl">{value}</p>
      <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
