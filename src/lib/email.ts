import { Resend } from "resend";
import { escapeHtml } from "./utils";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const EMAIL_SENDING_ENABLED = Boolean(RESEND_API_KEY);

if (!EMAIL_SENDING_ENABLED) {
  console.warn(
    "RESEND_API_KEY is not set. Email notifications will not be sent. User attempts will be logged instead.",
  );
}

const resend = EMAIL_SENDING_ENABLED ? new Resend(RESEND_API_KEY!) : null;

export async function sendTicketCreatedEmail(
  to: string,
  ticketId: string,
  subject: string,
): Promise<{ status: "sent" | "skipped"; message?: string }> {
  if (!resend) {
    const message = "Email sending disabled: RESEND_API_KEY not configured.";
    console.warn(message, { to, ticketId, subject });
    return { status: "skipped", message };
  }

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Your Support Ticket Has Been Created</h2>
          
          <p>Thank you for contacting NESK Support. We have received your ticket and will respond as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${escapeHtml(ticketId)}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          </div>
          
          <p>You can check the status of your ticket at any time by visiting our ticket status page with your ticket ID and email address.</p>
          
          <p>We aim to respond to all tickets within 24 hours during business days.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated email from NESK Help Desk. Please do not reply directly to this email.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.SUPPORT_EMAIL || "onboarding@resend.dev",
      to,
      subject: `Ticket Created: ${subject}`,
      html: htmlContent,
    });
    console.log(`Ticket created email sent to ${to}`);
    return { status: "sent" };
  } catch (error) {
    console.error("Error sending ticket created email:", error);
    return { status: "skipped", message: "Email send failed" };
  }
}

export async function sendTicketUpdateEmail(
  to: string,
  ticketId: string,
  subject: string,
  status: string,
  message?: string,
): Promise<{ status: "sent" | "skipped"; message?: string }> {
  if (!resend) {
    const msg = "Email sending disabled: RESEND_API_KEY not configured.";
    console.warn(msg, { to, ticketId, subject, status });
    return { status: "skipped", message: msg };
  }

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Your Support Ticket Has Been Updated</h2>
          
          <p>There has been an update to your support ticket.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${escapeHtml(ticketId)}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${escapeHtml(status)}</p>
          </div>
          
          ${
            message
              ? `
            <div style="background-color: #eff6ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <p style="margin: 0;"><strong>Latest Response:</strong></p>
              <p style="margin: 10px 0 0 0;">${escapeHtml(message)}</p>
            </div>
          `
              : ""
          }
          
          <p>You can view the full ticket details and conversation history by visiting our ticket status page.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated email from NESK Help Desk. Please do not reply directly to this email.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.SUPPORT_EMAIL || "onboarding@resend.dev",
      to,
      subject: `Ticket Update: ${subject}`,
      html: htmlContent,
    });
    console.log(`Ticket update email sent to ${to}`);
    return { status: "sent" };
  } catch (error) {
    console.error("Error sending ticket update email:", error);
    return { status: "skipped", message: "Email send failed" };
  }
}
