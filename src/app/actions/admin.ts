"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Check if user is admin
async function isAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return false;
  }

  return session.user.role === "admin";
}

// Log activity
async function logActivity(
  action: string,
  entityType: string,
  entityId?: string,
  details?: string,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const headersObj = await headers();
    const ipAddress =
      headersObj.get("x-forwarded-for") || headersObj.get("x-real-ip");

    await prisma.activityLog.create({
      data: {
        userId: session?.user?.id,
        action,
        entityType,
        entityId,
        details,
        ipAddress: ipAddress || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// ===== TEAM MEMBER MANAGEMENT =====

export async function getTeamMembers() {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        _count: {
          select: {
            kbArticles: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, teamMembers };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { error: "Failed to fetch team members" };
  }
}

export async function createTeamMember(data: {
  email: string;
  name: string;
  role: string;
}) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const existingMember = await prisma.teamMember.findUnique({
      where: { email: data.email },
    });

    if (existingMember) {
      return { error: "Team member with this email already exists" };
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
      },
    });

    await logActivity(
      "create",
      "team_member",
      teamMember.id,
      `Created team member: ${data.name}`,
    );
    revalidatePath("/admin/team");

    return { success: true, teamMember };
  } catch (error) {
    console.error("Error creating team member:", error);
    return { error: "Failed to create team member" };
  }
}

export async function updateTeamMember(
  id: string,
  data: {
    email?: string;
    name?: string;
    role?: string;
  },
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data,
    });

    await logActivity(
      "update",
      "team_member",
      id,
      `Updated team member: ${teamMember.name}`,
    );
    revalidatePath("/admin/team");

    return { success: true, teamMember };
  } catch (error) {
    console.error("Error updating team member:", error);
    return { error: "Failed to update team member" };
  }
}

export async function deleteTeamMember(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return { error: "Team member not found" };
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    await logActivity(
      "delete",
      "team_member",
      id,
      `Deleted team member: ${teamMember.name}`,
    );
    revalidatePath("/admin/team");

    return { success: true };
  } catch (error) {
    console.error("Error deleting team member:", error);
    return { error: "Failed to delete team member" };
  }
}

// ===== USER MANAGEMENT =====

export async function getUsers() {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  // Validate role
  const validRoles = ["user", "staff", "admin"];
  if (!validRoles.includes(newRole)) {
    return { error: "Invalid role" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await logActivity(
      "update",
      "user",
      userId,
      `Updated user role: ${user.email} -> ${newRole}`,
    );
    revalidatePath("/admin/team");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
}

export async function updateUser(
  userId: string,
  data: {
    name?: string | null;
    email?: string;
    emailVerified?: boolean;
  },
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // If email is being changed, check if it's already in use
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return { error: "Email already in use" };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    await logActivity(
      "update",
      "user",
      userId,
      `Updated user: ${updatedUser.email}`,
    );
    revalidatePath("/admin/team");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Failed to update user" };
  }
}

export async function deleteUser(userId: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    await logActivity("delete", "user", userId, `Deleted user: ${user.email}`);
    revalidatePath("/admin/team");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
}

// ===== SETTINGS MANAGEMENT =====

export async function getSettings(category?: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const where = category ? { category } : {};

    const settings = await prisma.setting.findMany({
      where,
      orderBy: {
        key: "asc",
      },
    });

    return { success: true, settings };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { error: "Failed to fetch settings" };
  }
}

export async function updateSetting(
  key: string,
  value: string,
  category = "general",
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, category },
    });

    await logActivity(
      "update",
      "setting",
      setting.id,
      `Updated setting: ${key}`,
    );
    revalidatePath("/admin/settings");

    return { success: true, setting };
  } catch (error) {
    console.error("Error updating setting:", error);
    return { error: "Failed to update setting" };
  }
}

export async function deleteSetting(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const setting = await prisma.setting.findUnique({
      where: { id },
    });

    if (!setting) {
      return { error: "Setting not found" };
    }

    await prisma.setting.delete({
      where: { id },
    });

    await logActivity(
      "delete",
      "setting",
      id,
      `Deleted setting: ${setting.key}`,
    );
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (error) {
    console.error("Error deleting setting:", error);
    return { error: "Failed to delete setting" };
  }
}

// ===== EMAIL TEMPLATE MANAGEMENT =====

export async function getEmailTemplates() {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, templates };
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return { error: "Failed to fetch email templates" };
  }
}

export async function getEmailTemplate(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return { error: "Template not found" };
    }

    return { success: true, template };
  } catch (error) {
    console.error("Error fetching email template:", error);
    return { error: "Failed to fetch email template" };
  }
}

export async function createEmailTemplate(data: {
  name: string;
  subject: string;
  body: string;
  variables: string;
  description?: string;
}) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const template = await prisma.emailTemplate.create({
      data,
    });

    await logActivity(
      "create",
      "email_template",
      template.id,
      `Created template: ${data.name}`,
    );
    revalidatePath("/admin/email-templates");

    return { success: true, template };
  } catch (error) {
    console.error("Error creating email template:", error);
    return { error: "Failed to create email template" };
  }
}

export async function updateEmailTemplate(
  id: string,
  data: {
    name?: string;
    subject?: string;
    body?: string;
    variables?: string;
    description?: string;
  },
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const template = await prisma.emailTemplate.update({
      where: { id },
      data,
    });

    await logActivity(
      "update",
      "email_template",
      id,
      `Updated template: ${template.name}`,
    );
    revalidatePath("/admin/email-templates");

    return { success: true, template };
  } catch (error) {
    console.error("Error updating email template:", error);
    return { error: "Failed to update email template" };
  }
}

export async function deleteEmailTemplate(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return { error: "Template not found" };
    }

    await prisma.emailTemplate.delete({
      where: { id },
    });

    await logActivity(
      "delete",
      "email_template",
      id,
      `Deleted template: ${template.name}`,
    );
    revalidatePath("/admin/email-templates");

    return { success: true };
  } catch (error) {
    console.error("Error deleting email template:", error);
    return { error: "Failed to delete email template" };
  }
}

// ===== CATEGORY MANAGEMENT =====

export async function getCategories() {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            kbArticles: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch categories" };
  }
}

export async function createCategory(data: {
  name: string;
  parentId?: string;
}) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        parentId: data.parentId || null,
      },
    });

    await logActivity(
      "create",
      "category",
      category.id,
      `Created category: ${data.name}`,
    );
    revalidatePath("/admin/categories");

    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: { name?: string; parentId?: string | null },
) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    await logActivity(
      "update",
      "category",
      id,
      `Updated category: ${category.name}`,
    );
    revalidatePath("/admin/categories");

    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tickets: true,
            kbArticles: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return { error: "Category not found" };
    }

    if (category._count.tickets > 0 || category._count.kbArticles > 0) {
      return {
        error: "Cannot delete category with associated tickets or articles",
      };
    }

    if (category._count.children > 0) {
      return { error: "Cannot delete category with subcategories" };
    }

    await prisma.category.delete({
      where: { id },
    });

    await logActivity(
      "delete",
      "category",
      id,
      `Deleted category: ${category.name}`,
    );
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}

// ===== REPORTS AND ANALYTICS =====

export async function getDashboardStats() {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      totalUsers,
      totalKbArticles,
      publishedKbArticles,
      teamMembers,
    ] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: "open" } }),
      prisma.ticket.count({ where: { status: "resolved" } }),
      prisma.user.count(),
      prisma.kbArticle.count(),
      prisma.kbArticle.count({ where: { published: true } }),
      prisma.teamMember.count(),
    ]);

    return {
      success: true,
      stats: {
        totalTickets,
        openTickets,
        resolvedTickets,
        totalUsers,
        totalKbArticles,
        publishedKbArticles,
        teamMembers,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { error: "Failed to fetch dashboard stats" };
  }
}

export async function getTicketStats(days = 30) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const tickets = await prisma.ticket.findMany({
      where: {
        openDate: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        status: true,
        openDate: true,
        lastUpdate: true,
        priority: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Group by status
    const byStatus = tickets.reduce(
      (acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group by priority
    const byPriority = tickets.reduce(
      (acc, ticket) => {
        const priority = ticket.priority?.name || "None";
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group by category
    const byCategory = tickets.reduce(
      (acc, ticket) => {
        const category = ticket.category?.name || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group by date
    const byDate = tickets.reduce(
      (acc, ticket) => {
        const date = ticket.openDate.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      success: true,
      stats: {
        total: tickets.length,
        byStatus,
        byPriority,
        byCategory,
        byDate,
      },
    };
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    return { error: "Failed to fetch ticket stats" };
  }
}

export async function getActivityLogs(limit = 50) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" };
  }

  try {
    const logs = await prisma.activityLog.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, logs };
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return { error: "Failed to fetch activity logs" };
  }
}
