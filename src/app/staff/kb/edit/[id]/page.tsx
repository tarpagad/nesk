"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getKbArticleForStaff, updateKbArticle } from "@/app/actions/staff";
import { KbArticleForm } from "../../KbArticleForm";

export default function EditKbArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      const result = await getKbArticleForStaff(articleId);
      if (result.success && result.article) {
        setArticle(result.article);
      } else {
        setError(result.error || "Failed to load article");
      }
      setLoading(false);
    }
    loadArticle();
  }, [articleId]);

  const handleSubmit = async (formData: FormData) => {
    return await updateKbArticle(articleId, formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error || "Article not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Article</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Update the knowledge base article</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
        <KbArticleForm article={article} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
