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
  const requesterEmail = formData.get("email") as string;
  const requesterName = (formData.get("name") as string) || "";

  // Validate inputs
  if (!subject || subject.trim().length === 0) {
    return { error: "Subject is required" };
  }

  if (!message || message.trim().length === 0) {
    return { error: "Message is required" };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Anonymous users must provide name and email
    if (!session?.user) {
      if (!requesterEmail || requesterEmail.trim().length === 0) {
        return { error: "Email is required to submit a ticket" };
      }

      if (!requesterName || requesterName.trim().length === 0) {
        return { error: "Name is required to submit a ticket" };
      }
    }

    // Resolve or create a user when not logged in
    let userId = session?.user.id;
    let emailForNotification = session?.user.email;

    if (!userId) {
      const normalizedEmail = normalizeEmail(requesterEmail);
      const user = await prisma.user.upsert({
        where: { email: normalizedEmail },
        update: {
          name: requesterName.trim(),
        },
        create: {
          email: normalizedEmail,
          name: requesterName.trim(),
          role: "user",
        },
      });

      userId = user.id;
      emailForNotification = user.email;
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject: subject.trim(),
        status: "open",
        userId,
        categoryId: categoryId || null,
        priorityId: priorityId || null,
      },
    });

    // Create initial reply with the message
    await prisma.ticketReply.create({
      data: {
        ticketId: ticket.id,
        authorId: userId,
        authorType: "customer",
        message: message.trim(),
        isInternal: false,
      },
    });

    // Send email notification (non-blocking warning if disabled)
    let emailWarning: string | undefined;
    try {
      if (emailForNotification) {
        const emailResult = await sendTicketCreatedEmail(
          emailForNotification,
          ticket.id,
          ticket.subject,
        );

        if (emailResult?.status === "skipped" && emailResult.message) {
          emailWarning = emailResult.message;
        }
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      emailWarning = "Email notification failed to send.";
    }

    revalidatePath("/tickets");

    return { success: true, ticketId: ticket.id, emailWarning };
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
