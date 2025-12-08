"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sendTicketCreatedEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/utils";

export async function createTicket(formData: FormData) {
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const categoryId = formData.get("categoryId") as string;
  const priorityId = formData.get("priorityId") as string;

  // Validate inputs
  if (!subject || subject.trim().length === 0) {
    return { error: "Subject is required" };
  }

  if (!message || message.trim().length === 0) {
    return { error: "Message is required" };
  }

  try {
    // Get current user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "You must be logged in to submit a ticket" };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject: subject.trim(),
        status: "open",
        userId: session.user.id,
        categoryId: categoryId || null,
        priorityId: priorityId || null,
      },
    });

    // Create initial reply with the message
    await prisma.ticketReply.create({
      data: {
        ticketId: ticket.id,
        authorId: session.user.id,
        authorType: "customer",
        message: message.trim(),
        isInternal: false,
      },
    });

    // Send email notification
    try {
      await sendTicketCreatedEmail(
        session.user.email,
        ticket.id,
        ticket.subject,
      );
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the ticket creation if email fails
    }

    revalidatePath("/tickets");

    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { error: "Failed to create ticket. Please try again." };
  }
}

export async function getTicketStatus(ticketId: string, email: string) {
  if (!ticketId || !email) {
    return { error: "Ticket ID and email are required" };
  }

  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: ticketId,
        user: {
          email: normalizeEmail(email),
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        priority: {
          select: {
            name: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
          where: {
            isInternal: false,
          },
        },
      },
    });

    if (!ticket) {
      return { error: "Ticket not found or email does not match" };
    }

    return { success: true, ticket };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return { error: "Failed to fetch ticket. Please try again." };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch categories" };
  }
}

export async function getPriorities() {
  try {
    const priorities = await prisma.priority.findMany({
      orderBy: {
        level: "asc",
      },
      select: {
        id: true,
        name: true,
        level: true,
      },
    });

    return { success: true, priorities };
  } catch (error) {
    console.error("Error fetching priorities:", error);
    return { error: "Failed to fetch priorities" };
  }
}
