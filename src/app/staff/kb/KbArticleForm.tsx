"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getCategories } from "@/app/actions/tickets";
import type { Category } from "@/types";

interface KbArticleFormProps {
  article?: {
    id: string;
    title: string;
    content: string;
    keywords: string;
    categoryId: string | null;
    published: boolean;
  };
  onSubmit: (
    formData: FormData,
  ) => Promise<{ success?: boolean; error?: string; articleId?: string }>;
}

export function KbArticleForm({ article, onSubmit }: KbArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [keywords, setKeywords] = useState(article?.keywords || "");
  const [categoryId, setCategoryId] = useState(article?.categoryId || "");
  const [published, setPublished] = useState(article?.published || false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = useCallback(async () => {
    const result = await getCategories();
    if (result.success && result.categories) {
      setCategories(result.categories);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("keywords", keywords);
    if (categoryId) formData.append("categoryId", categoryId);
    formData.append("published", published.toString());

    const result = await onSubmit(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(
        article
          ? "Article updated successfully!"
          : "Article created successfully!",
      );
      if (!article && result.articleId) {
        // Redirect to edit page after creation
        setTimeout(() => {
          router.push(`/staff/kb/edit/${result.articleId}`);
        }, 1500);
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border border-red-200 rounded text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3 border border-green-200 rounded text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title"
          className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
        >
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
        >
          <option value="">Uncategorized</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="keywords"
          className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
        >
          Keywords
        </label>
        <input
          id="keywords"
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., login, password, reset (comma-separated)"
          className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full"
        />
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          Enter keywords separated by commas to help users find this article
        </p>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm"
        >
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          required
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article content here..."
          className="px-3 py-2 border border-gray-300 focus:border-blue-500 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 w-full font-mono text-sm"
        />
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          You can use markdown formatting
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 text-blue-600"
        />
        <label
          htmlFor="published"
          className="text-gray-700 dark:text-gray-300 text-sm"
        >
          Publish this article (make it visible to customers)
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-md font-medium text-white"
        >
          {loading
            ? "Saving..."
            : article
              ? "Update Article"
              : "Create Article"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/staff/kb")}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-md font-medium text-gray-700 dark:text-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
