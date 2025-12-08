"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { KbArticleForm } from "../../KbArticleForm";
import { getKbArticleForStaff, updateKbArticle } from "@/app/actions/staff";

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
        <div className="text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Article not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
        <p className="mt-2 text-gray-600">
          Update the knowledge base article
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <KbArticleForm article={article} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
