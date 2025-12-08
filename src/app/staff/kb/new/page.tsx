"use client";

import { createKbArticle } from "@/app/actions/staff";
import { KbArticleForm } from "../KbArticleForm";

export default function NewKbArticlePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        <p className="mt-2 text-gray-600">
          Write a new knowledge base article to help customers
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <KbArticleForm onSubmit={createKbArticle} />
      </div>
    </div>
  );
}
