"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Check if user is staff
async function isStaff() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return false;
  }

  return session.user.role === "staff" || session.user.role === "admin";
}

// Get tickets for staff with filters
export async function getTicketsForStaff(filters: {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    const where: {
      status?: string;
      priority?: { name: { equals: string; mode: "insensitive" } };
      category?: { name: { equals: string; mode: "insensitive" } };
      OR?: Array<
        | { subject: { contains: string; mode: "insensitive" } }
        | { id: { contains: string } }
      >;
    } = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: "insensitive" } },
        { id: { contains: filters.search } },
      ];
    }

    if (filters.priority) {
      where.priority = {
        name: { equals: filters.priority, mode: "insensitive" },
      };
    }

    if (filters.category) {
      where.category = {
        name: { equals: filters.category, mode: "insensitive" },
      };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        priority: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          where: {
            isInternal: false,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        lastUpdate: "desc",
      },
    });

    return { success: true, tickets };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { error: "Failed to fetch tickets" };
  }
}

// Get single ticket details for staff
export async function getTicketForStaff(ticketId: string) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        priority: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!ticket) {
      return { error: "Ticket not found" };
    }

    return { success: true, ticket };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return { error: "Failed to fetch ticket" };
  }
}

// Update ticket status
export async function updateTicketStatus(ticketId: string, status: string) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  const validStatuses = [
    "open",
    "in_progress",
    "waiting_customer",
    "resolved",
    "closed",
  ];

  if (!validStatuses.includes(status)) {
    return { error: "Invalid status" };
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });

    revalidatePath(`/staff/tickets/${ticketId}`);
    revalidatePath("/staff/tickets");

    return { success: true };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { error: "Failed to update ticket status" };
  }
}

// Update ticket priority
export async function updateTicketPriority(
  ticketId: string,
  priorityId: string | null,
) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { priorityId },
    });

    revalidatePath(`/staff/tickets/${ticketId}`);
    revalidatePath("/staff/tickets");

    return { success: true };
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    return { error: "Failed to update ticket priority" };
  }
}

// Update ticket category
export async function updateTicketCategory(
  ticketId: string,
  categoryId: string | null,
) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { categoryId },
    });

    revalidatePath(`/staff/tickets/${ticketId}`);
    revalidatePath("/staff/tickets");

    return { success: true };
  } catch (error) {
    console.error("Error updating ticket category:", error);
    return { error: "Failed to update ticket category" };
  }
}

// Add reply to ticket (public or internal)
export async function addTicketReply(
  ticketId: string,
  message: string,
  isInternal: boolean,
) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  if (!message || message.trim().length === 0) {
    return { error: "Message is required" };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    await prisma.ticketReply.create({
      data: {
        ticketId,
        authorId: session.user.id,
        authorType: "staff",
        message: message.trim(),
        isInternal,
      },
    });

    // Update ticket's lastUpdate timestamp
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { lastUpdate: new Date() },
    });

    revalidatePath(`/staff/tickets/${ticketId}`);
    revalidatePath("/staff/tickets");

    return { success: true };
  } catch (error) {
    console.error("Error adding reply:", error);
    return { error: "Failed to add reply" };
  }
}

// Assign ticket to staff member
export async function assignTicket(
  ticketId: string,
  assignedTo: string | null,
) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { assignedTo },
    });

    revalidatePath(`/staff/tickets/${ticketId}`);
    revalidatePath("/staff/tickets");

    return { success: true };
  } catch (error) {
    console.error("Error assigning ticket:", error);
    return { error: "Failed to assign ticket" };
  }
}

// KB Article Management

// Get single KB article for editing (includes drafts)
export async function getKbArticleForStaff(id: string) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    const article = await prisma.kbArticle.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!article) {
      return { error: "Article not found" };
    }

    return { success: true, article };
  } catch (error) {
    console.error("Error fetching KB article:", error);
    return { error: "Failed to fetch article" };
  }
}

// Create KB article
export async function createKbArticle(formData: FormData) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const keywords = formData.get("keywords") as string;
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "true";

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  if (!content || content.trim().length === 0) {
    return { error: "Content is required" };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Not authenticated" };
    }

    // Check if TeamMember exists for this user, if not create one
    let teamMember = await prisma.teamMember.findUnique({
      where: { email: session.user.email },
    });

    if (!teamMember) {
      teamMember = await prisma.teamMember.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email,
          role: session.user.role || "staff",
        },
      });
    }

    const article = await prisma.kbArticle.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        keywords: keywords?.trim() || "",
        categoryId: categoryId || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: teamMember.id,
      },
    });

    revalidatePath("/staff/kb");
    revalidatePath("/kb");

    return { success: true, articleId: article.id };
  } catch (error) {
    console.error("Error creating KB article:", error);
    return { error: "Failed to create article" };
  }
}

// Update KB article
export async function updateKbArticle(id: string, formData: FormData) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const keywords = formData.get("keywords") as string;
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "true";

  if (!title || title.trim().length === 0) {
    return { error: "Title is required" };
  }

  if (!content || content.trim().length === 0) {
    return { error: "Content is required" };
  }

  try {
    const existingArticle = await prisma.kbArticle.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return { error: "Article not found" };
    }

    await prisma.kbArticle.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        keywords: keywords?.trim() || "",
        categoryId: categoryId || null,
        published,
        publishedAt:
          published && !existingArticle.published
            ? new Date()
            : existingArticle.publishedAt,
      },
    });

    revalidatePath("/staff/kb");
    revalidatePath(`/staff/kb/edit/${id}`);
    revalidatePath("/kb");

    return { success: true };
  } catch (error) {
    console.error("Error updating KB article:", error);
    return { error: "Failed to update article" };
  }
}

// Delete KB article
export async function deleteKbArticle(id: string) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.kbArticle.delete({
      where: { id },
    });

    revalidatePath("/staff/kb");
    revalidatePath("/kb");

    return { success: true };
  } catch (error) {
    console.error("Error deleting KB article:", error);
    return { error: "Failed to delete article" };
  }
}

// Toggle KB article published status
export async function toggleKbArticlePublished(id: string) {
  if (!(await isStaff())) {
    return { error: "Unauthorized" };
  }

  try {
    const article = await prisma.kbArticle.findUnique({
      where: { id },
    });

    if (!article) {
      return { error: "Article not found" };
    }

    await prisma.kbArticle.update({
      where: { id },
      data: {
        published: !article.published,
        publishedAt:
          !article.published && !article.publishedAt
            ? new Date()
            : article.publishedAt,
      },
    });

    revalidatePath("/staff/kb");
    revalidatePath("/kb");

    return { success: true };
  } catch (error) {
    console.error("Error toggling article status:", error);
    return { error: "Failed to toggle article status" };
  }
}
