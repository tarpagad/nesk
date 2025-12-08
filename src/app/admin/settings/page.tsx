"use client";

import { useEffect, useState } from "react";
import { deleteSetting, getSettings, updateSetting } from "@/app/actions/admin";

type Setting = {
  id: string;
  key: string;
  value: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    { id: "general", label: "General" },
    { id: "email", label: "Email" },
    { id: "notifications", label: "Notifications" },
    { id: "sla", label: "SLA" },
  ];

  useEffect(() => {
    loadSettings();
  }, [activeCategory]);

  async function loadSettings() {
    setLoading(true);
    const result = await getSettings(activeCategory);
    if ("error" in result) {
      setError(result.error || "Failed to load settings");
    } else {
      setSettings(result.settings);
      const initialFormData: Record<string, string> = {};
      result.settings.forEach((setting) => {
        initialFormData[setting.key] = setting.value;
      });
      setFormData(initialFormData);
    }
    setLoading(false);
  }

  async function handleSave(key: string) {
    setError("");
    setSuccess("");

    const result = await updateSetting(key, formData[key], activeCategory);
    if ("error" in result) {
      setError(result.error || "Failed to update setting");
    } else {
      setSuccess(`Setting "${key}" updated successfully`);
      setEditingKey(null);
      loadSettings();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this setting?")) {
      return;
    }

    const result = await deleteSetting(id);
    if ("error" in result) {
      setError(result.error || "Failed to delete setting");
    } else {
      setSuccess("Setting deleted successfully");
      loadSettings();
    }
  }

  function handleChange(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-3xl">
          System Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Configure your help desk system
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 mb-6 p-4 border border-red-200 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 mb-6 p-4 border border-green-200 rounded-lg text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 border-gray-200 dark:border-gray-700 border-b">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Settings List */}
      <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {settings.length === 0 ? (
            <div className="p-8 text-gray-500 dark:text-gray-400 text-center">
              No settings configured for this category yet
            </div>
          ) : (
            settings.map((setting) => (
              <div key={setting.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {setting.key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </label>
                    {editingKey === setting.key ? (
                      <div className="space-y-3">
                        <textarea
                          value={formData[setting.key] || ""}
                          onChange={(e) =>
                            handleChange(setting.key, e.target.value)
                          }
                          rows={3}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(setting.key)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-gray-700 dark:text-gray-300 text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                          {setting.value}
                        </p>
                        <p className="mt-2 text-gray-400 text-xs">
                          Last updated:{" "}
                          {new Date(setting.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  {editingKey !== setting.key && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingKey(setting.key)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(setting.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Settings Guide */}
      <div className="bg-blue-50 dark:bg-blue-900/30 mt-8 p-6 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="mb-3 font-semibold text-blue-900 text-sm">
          Common Settings
        </h3>
        <div className="space-y-2 text-blue-800 dark:text-blue-400 text-sm">
          <p>
            <strong>General:</strong> site_name, support_email, timezone
          </p>
          <p>
            <strong>Email:</strong> smtp_host, smtp_port, from_email, from_name
          </p>
          <p>
            <strong>Notifications:</strong> enable_email_notifications,
            enable_sms_notifications
          </p>
          <p>
            <strong>SLA:</strong> response_time_hours, resolution_time_hours
          </p>
        </div>
        <p className="mt-4 text-blue-700 text-xs">
          To add new settings, use the updateSetting action with the desired key
          and value.
        </p>
      </div>
    </div>
  );
}
