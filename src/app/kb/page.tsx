"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { getKbCategories, getPublishedKbArticles } from "@/app/actions/kb";
import { Navbar } from "@/app/Navbar";
import { useI18n } from "@/lib/i18n";
import { formatDate, truncateText } from "@/lib/utils";
import type { KbArticle, KbCategoryWithCount } from "@/types";

const CONTENT_PREVIEW_LENGTH = 200;
const SEARCH_DEBOUNCE_MS = 400;

function KnowledgeBaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const categoryFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search");

  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [categories, setCategories] = useState<KbCategoryWithCount[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "",
  );
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    const result = await getKbCategories();
    if (result.success) {
      setCategories(result.categories || []);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");

    const trimmedSearch = debouncedSearch.trim();
    const result = await getPublishedKbArticles(
      selectedCategory || undefined,
      trimmedSearch || undefined,
    );

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      const transformedArticles = (result.articles || []).map((article) => ({
        ...article,
        publishedAt: article.publishedAt?.toISOString() || null,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      }));
      setArticles(transformedArticles);
    }

    setLoading(false);
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    const query = params.toString();
    router.replace(query ? `/kb?${query}` : "/kb");
  }, [debouncedSearch, router, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchQuery.trim());
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setDebouncedSearch("");
  };

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-gray-900 py-12 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
              {t("kb.list.title")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t("kb.list.subtitle")}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 mb-8 p-6 rounded-lg">
            <form
              onSubmit={handleSearch}
              className="gap-4 grid md:grid-cols-12"
            >
              <div className="md:col-span-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("kb.list.searchPlaceholder")}
                  className="block shadow-sm dark:shadow-gray-900 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                />
              </div>
              <div className="md:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="block shadow-sm dark:shadow-gray-900 px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
                >
                  <option value="">{t("kb.list.allCategories")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat._count.kbArticles})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-white"
                >
                  {t("kb.list.search")}
                </button>
                {(selectedCategory || searchQuery) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300"
                  >
                    {t("kb.list.clear")}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Category Chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() =>
                    handleCategoryChange(
                      selectedCategory === cat.id ? "" : cat.id,
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {cat.name} ({cat._count.kbArticles})
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-12 rounded-lg text-center">
              <div className="text-gray-600 dark:text-gray-400">
                {t("kb.list.loading")}
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 shadow dark:shadow-gray-900 p-6 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400">
                {error || t("kb.list.error")}
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 p-12 rounded-lg text-center">
              <div className="mb-4 text-6xl">📚</div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100 text-xl">
                {t("kb.list.noArticles")}
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {debouncedSearch || selectedCategory
                  ? t("kb.list.emptyFiltered")
                  : t("kb.list.empty")}
              </p>
              {(searchFromUrl || selectedCategory) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium text-white"
                >
                  {t("kb.list.clearFilters")}
                </button>
              )}
            </div>
          ) : (
            <div className="gap-6 grid">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/kb/${article.id}`}
                  className="block bg-white dark:bg-gray-800 shadow hover:shadow-lg dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="flex-1 font-semibold text-gray-900 hover:text-blue-600 dark:text-gray-100 text-xl">
                      {article.title}
                    </h2>
                    {article.category && (
                      <span className="bg-blue-100 ml-4 px-3 py-1 rounded-full font-medium text-blue-800 dark:text-blue-400 text-sm">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2">
                    {truncateText(article.content, CONTENT_PREVIEW_LENGTH)}
                  </p>
                  <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 text-sm">
                    <span>
                      {t("kb.list.by", { author: article.author.name })}
                    </span>
                    <span>
                      {t("kb.list.updated", {
                        date: formatDate(article.updatedAt),
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Help Section */}
          <div className="bg-blue-50 dark:bg-blue-900/30 shadow dark:shadow-gray-900 mt-8 p-6 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="mb-2 font-semibold text-blue-900 text-lg">
              {t("kb.list.helpTitle")}
            </h3>
            <p className="mb-4 text-blue-800 dark:text-blue-400">
              {t("kb.list.helpBody")}
            </p>
            <Link
              href="/tickets/submit"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium text-white"
            >
              {t("kb.list.submit")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function KnowledgeBasePage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          {t("kb.list.loading")}
        </div>
      }
    >
      <KnowledgeBaseContent />
    </Suspense>
  );
}
