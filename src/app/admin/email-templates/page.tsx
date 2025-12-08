"use client";

import { useEffect, useState } from "react";
import {
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate,
} from "@/app/actions/admin";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    variables: "[]",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    const result = await getEmailTemplates();
    if ("error" in result) {
      setError(result.error || "Failed to load templates");
    } else {
      setTemplates(result.templates);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (editingId) {
      const result = await updateEmailTemplate(editingId, formData);
      if ("error" in result) {
        setError(result.error || "Failed to update template");
      } else {
        setEditingId(null);
        setFormData({
          name: "",
          subject: "",
          body: "",
          variables: "[]",
          description: "",
        });
        loadTemplates();
      }
    } else {
      const result = await createEmailTemplate(formData);
      if ("error" in result) {
        setError(result.error || "Failed to create template");
      } else {
        setShowAddForm(false);
        setFormData({
          name: "",
          subject: "",
          body: "",
          variables: "[]",
          description: "",
        });
        loadTemplates();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    const result = await deleteEmailTemplate(id);
    if ("error" in result) {
      setError(result.error || "Failed to delete template");
    } else {
      loadTemplates();
    }
  }

  function startEdit(template: EmailTemplate) {
    setEditingId(template.id);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
      description: template.description || "",
    });
    setShowAddForm(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: "",
      subject: "",
      body: "",
      variables: "[]",
      description: "",
    });
    setError("");
  }

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
            Email Templates
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Customize email notifications sent to customers
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
        >
          {showAddForm ? "Cancel" : "Create Template"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 mb-6 p-4 border border-red-200 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100 text-xl">
            {editingId ? "Edit Template" : "Create Template"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="e.g., new_ticket_confirmation"
                className="px-3 py-2 border border-gray-300 focus:border-transparent dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of this template"
                className="px-3 py-2 border border-gray-300 focus:border-transparent dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                placeholder="Email subject line (can use {{variables}})"
                className="px-3 py-2 border border-gray-300 focus:border-transparent dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Body
              </label>
              <textarea
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                required
                rows={10}
                placeholder="Email body (can use {{variables}})"
                className="px-3 py-2 border border-gray-300 focus:border-transparent dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 w-full font-mono text-sm"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Available Variables (JSON Array)
              </label>
              <input
                type="text"
                value={formData.variables}
                onChange={(e) =>
                  setFormData({ ...formData, variables: e.target.value })
                }
                required
                placeholder='["ticketId", "customerName", "subject"]'
                className="px-3 py-2 border border-gray-300 focus:border-transparent dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 w-full font-mono text-sm"
              />
              <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                Example: ["ticketId", "customerName", "ticketSubject",
                "supportEmail"]
              </p>
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
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-4">
        {templates.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-8 border border-gray-200 rounded-lg text-gray-500 dark:text-gray-400 text-center">
            No email templates yet
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                      {template.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(template)}
                    className="hover:bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded text-blue-600 text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="hover:bg-red-50 dark:bg-red-900/20 dark:hover:bg-red-900/30 px-3 py-1 rounded text-red-600 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase">
                    Subject:
                  </span>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 text-sm">
                    {template.subject}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase">
                    Body:
                  </span>
                  <pre className="bg-white dark:bg-gray-900 mt-1 p-3 border border-gray-200 rounded font-mono text-gray-900 dark:text-gray-100 text-sm whitespace-pre-wrap">
                    {template.body.length > 200
                      ? `${template.body.substring(0, 200)}...`
                      : template.body}
                  </pre>
                </div>
                <div>
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase">
                    Variables:
                  </span>
                  <p className="mt-1 font-mono text-gray-900 dark:text-gray-100 text-sm">
                    {template.variables}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-gray-200 border-t text-gray-500 dark:text-gray-400 text-xs">
                Last updated: {new Date(template.updatedAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
