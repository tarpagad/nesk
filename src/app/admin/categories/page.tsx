"use client";

import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/app/actions/admin";

type Category = {
  id: string;
  name: string;
  parentId: string | null;
  parent?: {
    id: string;
    name: string;
  } | null;
  children: {
    id: string;
    name: string;
  }[];
  _count: {
    tickets: number;
    kbArticles: number;
  };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    parentId: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const result = await getCategories();
    if ("error" in result) {
      setError(result.error);
    } else {
      setCategories(result.categories);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (editingId) {
      const result = await updateCategory(editingId, {
        name: formData.name,
        parentId: formData.parentId || null,
      });
      if ("error" in result) {
        setError(result.error);
      } else {
        setEditingId(null);
        setFormData({ name: "", parentId: "" });
        loadCategories();
      }
    } else {
      const result = await createCategory({
        name: formData.name,
        parentId: formData.parentId || undefined,
      });
      if ("error" in result) {
        setError(result.error);
      } else {
        setShowAddForm(false);
        setFormData({ name: "", parentId: "" });
        loadCategories();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    const result = await deleteCategory(id);
    if ("error" in result) {
      setError(result.error);
    } else {
      loadCategories();
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      parentId: category.parentId || "",
    });
    setShowAddForm(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ name: "", parentId: "" });
    setError("");
  }

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-gray-900 text-3xl">Categories</h1>
          <p className="mt-2 text-gray-600">
            Manage categories for tickets and KB articles
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
        >
          {showAddForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 mb-6 p-4 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white shadow-sm mb-6 p-6 border border-gray-200 rounded-lg">
          <h2 className="mb-4 font-semibold text-gray-900 text-xl">
            {editingId ? "Edit Category" : "Add Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Parent Category (Optional)
              </label>
              <select
                value={formData.parentId}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">None (Top Level)</option>
                {categories
                  .filter((cat) => cat.id !== editingId)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-gray-200 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                Subcategories
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                Tickets
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider">
                KB Articles
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 text-xs text-right uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-gray-500 text-center">
                  No categories yet
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 text-sm">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600 text-sm">
                      {category.parent?.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                    {category.children.length}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                    {category._count.tickets}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm whitespace-nowrap">
                    {category._count.kbArticles}
                  </td>
                  <td className="px-6 py-4 font-medium text-sm text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(category)}
                      className="mr-4 text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
