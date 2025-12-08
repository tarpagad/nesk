"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteUser,
  getUsers,
  updateUser,
  updateUserRole,
} from "@/app/actions/admin";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
};

type EditingUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
};

export default function TeamManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const result = await getUsers();
    if ("error" in result) {
      setError(result.error || "Failed to load users");
    } else {
      setUsers(result.users);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function startEditing(user: User) {
    setEditingUser({
      id: user.id,
      name: user.name || "",
      email: user.email,
      emailVerified: user.emailVerified,
    });
    setError("");
  }

  function cancelEditing() {
    setEditingUser(null);
    setError("");
  }

  async function saveUser() {
    if (!editingUser) return;

    setSaving(true);
    const result = await updateUser(editingUser.id, {
      name: editingUser.name || null,
      email: editingUser.email,
      emailVerified: editingUser.emailVerified,
    });

    if ("error" in result) {
      setError(result.error || "Failed to update user");
    } else {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: editingUser.name || null,
                email: editingUser.email,
                emailVerified: editingUser.emailVerified,
              }
            : u,
        ),
      );
      setEditingUser(null);
      setError("");
    }
    setSaving(false);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    const result = await updateUserRole(userId, newRole);
    if ("success" in result) {
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } else if ("error" in result) {
      setError(result.error || "Failed to update role");
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const result = await deleteUser(userId);
    if ("success" in result) {
      setUsers(users.filter((u) => u.id !== userId));
    } else if ("error" in result) {
      setError(result.error || "Failed to delete user");
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="py-12 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-bold text-gray-900 dark:text-gray-100 text-2xl">Team Management</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
          Manage team members, roles, and permissions
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 mb-6 p-4 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900 rounded-lg overflow-hidden">
        <table className="divide-y divide-gray-200 dark:divide-gray-700 min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs text-left uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-gray-500 dark:text-gray-400 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isEditing = editingUser?.id === user.id;

                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              name: e.target.value,
                            })
                          }
                          className="shadow-sm dark:shadow-gray-900 px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm"
                          placeholder="User name"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 shrink-0">
                            <div className="flex justify-center items-center bg-blue-500 rounded-full w-10 h-10 font-semibold text-white">
                              {user.name?.[0]?.toUpperCase() ||
                                user.email[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {user.name || "No name"}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              email: e.target.value,
                            })
                          }
                          className="shadow-sm dark:shadow-gray-900 px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-sm"
                          placeholder="Email"
                        />
                      ) : (
                        <div className="text-gray-900 dark:text-gray-100 text-sm">
                          {user.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={isEditing}
                        className="disabled:opacity-50 shadow-sm dark:shadow-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-md focus:ring-blue-500 text-sm disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={
                            editingUser.emailVerified
                              ? "verified"
                              : "unverified"
                          }
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              emailVerified: e.target.value === "verified",
                            })
                          }
                          className="shadow-sm dark:shadow-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-md focus:ring-blue-500 text-sm"
                        >
                          <option value="verified">Verified</option>
                          <option value="unverified">Unverified</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 inline-flex font-semibold text-xs leading-5 rounded-full ${
                            user.emailVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-sm whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveUser}
                            disabled={saving}
                            className="disabled:opacity-50 text-blue-600 hover:text-blue-900"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={saving}
                            className="disabled:opacity-50 text-gray-600 hover:text-gray-900 dark:text-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEditing(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
