import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getKbArticles() {
  return await prisma.kbArticle.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export default async function StaffKbPage() {
  const articles = await getKbArticles();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
            Knowledge Base Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and manage knowledge base articles
          </p>
        </div>
        <Link
          href="/staff/kb/new"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium text-white"
        >
          Create Article
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-lg overflow-hidden">
        {articles.length === 0 ? (
          <div className="px-6 py-12 text-gray-500 dark:text-gray-400 text-center">
            <p className="mb-4">No articles found</p>
            <Link
              href="/staff/kb/new"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
              <thead className="bg-white dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100 text-sm">
                      <Link
                        href={`/kb/${article.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {article.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {article.author.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {article.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="space-x-4 px-6 py-4 font-medium text-sm whitespace-nowrap">
                      <Link
                        href={`/staff/kb/edit/${article.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/kb/${article.id}`}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-100"
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
    </div>
  );
}
