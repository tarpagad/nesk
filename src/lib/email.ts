import { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";

const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.warn(
    "BREVO_API_KEY is not set. Email notifications will not be sent."
  );
}

let brevoClient: TransactionalEmailsApi | null = null;

if (BREVO_API_KEY) {
  brevoClient = new TransactionalEmailsApi();
  brevoClient.setApiKey(0, BREVO_API_KEY);
}

// HTML escape helper to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function sendTicketCreatedEmail(
  to: string,
  ticketId: string,
  subject: string
) {
  if (!brevoClient) {
    console.log("Skipping email - BREVO_API_KEY not configured");
    return;
  }

  const emailData = new SendSmtpEmail();
  emailData.sender = {
    email: process.env.SUPPORT_EMAIL || "support@nesk.example.com",
    name: "NESK Support",
  };
  emailData.to = [{ email: to }];
  emailData.subject = `Ticket Created: ${subject}`;
  emailData.htmlContent = `
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
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Ticket created email sent to ${to}`);
  } catch (error) {
    console.error("Error sending ticket created email:", error);
  }
}

export async function sendTicketUpdateEmail(
  to: string,
  ticketId: string,
  subject: string,
  status: string,
  message?: string
) {
  if (!brevoClient) {
    console.log("Skipping email - BREVO_API_KEY not configured");
    return;
  }

  const emailData = new SendSmtpEmail();
  emailData.sender = {
    email: process.env.SUPPORT_EMAIL || "support@nesk.example.com",
    name: "NESK Support",
  };
  emailData.to = [{ email: to }];
  emailData.subject = `Ticket Update: ${subject}`;
  emailData.htmlContent = `
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
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Ticket update email sent to ${to}`);
  } catch (error) {
    console.error("Error sending ticket update email:", error);
  }
}
