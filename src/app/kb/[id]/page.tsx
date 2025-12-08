"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getKbArticleById } from "@/app/actions/kb";
import Link from "next/link";

export default function KbArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    setLoading(true);
    setError("");

    const result = await getKbArticleById(articleId);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setArticle(result.article);
    }

    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white shadow p-12 rounded-lg text-center">
            <div className="text-gray-600">Loading article...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-red-50 shadow p-6 border border-red-200 rounded-lg">
            <h2 className="mb-2 font-semibold text-red-900 text-xl">
              Article Not Found
            </h2>
            <p className="mb-4 text-red-700">
              {error || "The article you're looking for doesn't exist."}
            </p>
            <Link
              href="/kb"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium text-white"
            >
              Back to Knowledge Base
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/kb" className="text-blue-600 hover:text-blue-800">
                Knowledge Base
              </Link>
            </li>
            {article.category && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href={`/kb?category=${article.category.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {article.category.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Article */}
        <article className="bg-white shadow rounded-lg">
          <div className="border-gray-200 px-6 py-6 border-b">
            <div className="mb-4">
              {article.category && (
                <Link
                  href={`/kb?category=${article.category.id}`}
                  className="inline-block bg-blue-100 hover:bg-blue-200 mb-3 px-3 py-1 rounded-full font-medium text-blue-800 text-sm"
                >
                  {article.category.name}
                </Link>
              )}
            </div>
            <h1 className="mb-4 font-bold text-3xl text-gray-900">
              {article.title}
            </h1>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="mr-4">By {article.author.name}</span>
              <span className="mr-4">•</span>
              <span>Published {formatDate(article.publishedAt || article.createdAt)}</span>
              {article.updatedAt !== article.createdAt && (
                <>
                  <span className="mx-4">•</span>
                  <span>Updated {formatDate(article.updatedAt)}</span>
                </>
              )}
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="prose prose-blue max-w-none">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {article.content}
              </div>
            </div>
          </div>

          {article.keywords && (
            <div className="bg-gray-50 px-6 py-4 border-gray-200 border-t">
              <h3 className="mb-2 font-semibold text-gray-700 text-sm">
                Keywords:
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.split(",").map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full text-gray-700 text-sm"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Helpful Section */}
        <div className="bg-blue-50 shadow mt-8 p-6 border border-blue-200 rounded-lg">
          <h3 className="mb-2 font-semibold text-blue-900 text-lg">
            Was this article helpful?
          </h3>
          <p className="mb-4 text-blue-800">
            If this didn't solve your issue, you can submit a support ticket
            for personalized assistance.
          </p>
          <div className="flex gap-4">
            <Link
              href="/kb"
              className="inline-block bg-white hover:bg-gray-100 px-6 py-2 border border-blue-300 rounded-md font-medium text-blue-700"
            >
              Browse More Articles
            </Link>
            <Link
              href="/tickets/submit"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium text-white"
            >
              Submit a Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
