import "dotenv/config";
import { hash } from "bcrypt";
import kbArticlesData from "../data/kb-articles.json";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Create admin user for Better Auth
  console.log("👤 Creating admin user account...");
  const hashedPassword = await hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nesk.example.com" },
    update: {},
    create: {
      email: "admin@nesk.example.com",
      name: "Admin User",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: "admin",
    },
  });

  // Create password entry for admin user
  await prisma.account.upsert({
    where: {
      id: `email-password:${adminUser.id}`,
    },
    update: {},
    create: {
      id: `email-password:${adminUser.id}`,
      accountId: adminUser.id,
      providerId: "credential",
      userId: adminUser.id,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`  ✓ Admin user created (admin@nesk.example.com / admin123)\n`);

  // Create categories first
  console.log("📁 Creating categories...");
  const categories = [
    "Getting Started",
    "Account Management",
    "Ticket Management",
    "Troubleshooting",
    "Billing & Subscriptions",
  ];

  const createdCategories: { [key: string]: string } = {};

  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
    createdCategories[categoryName] = category.id;
    console.log(`  ✓ ${categoryName}`);
  }

  // Create priority levels
  console.log("\n🎯 Creating priority levels...");
  const priorities = [
    { name: "Low", level: 1 },
    { name: "Medium", level: 2 },
    { name: "High", level: 3 },
    { name: "Critical", level: 4 },
  ];

  for (const priority of priorities) {
    await prisma.priority.upsert({
      where: { name: priority.name },
      update: { level: priority.level },
      create: priority,
    });
    console.log(`  ✓ ${priority.name}`);
  }

  // Create team members (staff)
  console.log("\n👥 Creating team members...");
  const teamMembers = [
    {
      email: "admin@nesk.example.com",
      name: "Admin User",
      role: "admin",
    },
    {
      email: "sarah.tech@nesk.example.com",
      name: "Sarah Johnson",
      role: "staff",
    },
    {
      email: "mike.support@nesk.example.com",
      name: "Mike Chen",
      role: "staff",
    },
  ];

  const createdTeamMembers: { [key: string]: string } = {};

  for (const member of teamMembers) {
    const teamMember = await prisma.teamMember.upsert({
      where: { email: member.email },
      update: { name: member.name, role: member.role },
      create: member,
    });
    createdTeamMembers[member.email] = teamMember.id;
    console.log(`  ✓ ${member.name} (${member.role})`);
  }

  // Create KB articles
  console.log("\n📚 Creating knowledge base articles...");
  let articleCount = 0;

  for (const article of kbArticlesData) {
    const categoryId = createdCategories[article.categoryName];
    const authorId = createdTeamMembers["admin@nesk.example.com"];

    await prisma.kbArticle.create({
      data: {
        title: article.title,
        content: article.content,
        keywords: article.keywords,
        published: true,
        publishedAt: new Date(),
        categoryId,
        authorId,
      },
    });
    articleCount++;
    console.log(`  ✓ ${article.title}`);
  }

  // Create some demo users
  console.log("\n👤 Creating demo users...");
  const demoUsers = [
    {
      email: "customer1@example.com",
      name: "John Doe",
      role: "user",
    },
    {
      email: "customer2@example.com",
      name: "Jane Smith",
      role: "user",
    },
  ];

  const createdUsers: { [key: string]: string } = {};

  for (const user of demoUsers) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: true,
      },
    });
    createdUsers[user.email] = createdUser.id;
    console.log(`  ✓ ${user.name}`);
  }

  // Create some demo tickets
  console.log("\n🎫 Creating demo tickets...");
  const lowPriority = await prisma.priority.findUnique({
    where: { name: "Low" },
  });
  const mediumPriority = await prisma.priority.findUnique({
    where: { name: "Medium" },
  });
  const highPriority = await prisma.priority.findUnique({
    where: { name: "High" },
  });

  const gettingStartedCategory = await prisma.category.findUnique({
    where: { name: "Getting Started" },
  });

  const tickets = [
    {
      subject: "How do I reset my password?",
      status: "resolved",
      userId: createdUsers["customer1@example.com"],
      categoryId: gettingStartedCategory?.id,
      priorityId: lowPriority?.id,
    },
    {
      subject: "Unable to submit ticket with attachment",
      status: "in_progress",
      userId: createdUsers["customer2@example.com"],
      categoryId: gettingStartedCategory?.id,
      priorityId: mediumPriority?.id,
    },
    {
      subject: "Critical: System down",
      status: "open",
      userId: createdUsers["customer1@example.com"],
      categoryId: gettingStartedCategory?.id,
      priorityId: highPriority?.id,
    },
  ];

  for (const ticket of tickets) {
    const createdTicket = await prisma.ticket.create({
      data: ticket,
    });
    console.log(
      `  ✓ Ticket #${createdTicket.id.slice(0, 8)}: ${ticket.subject}`,
    );

    // Add a reply to resolved ticket
    if (ticket.status === "resolved") {
      await prisma.ticketReply.create({
        data: {
          ticketId: createdTicket.id,
          authorId: createdTeamMembers["sarah.tech@nesk.example.com"],
          authorType: "staff",
          message:
            "You can reset your password by clicking 'Forgot Password' on the sign-in page. Check your email for the reset link.",
          isInternal: false,
        },
      });
      console.log(`    ↳ Added reply from Sarah`);
    }
  }

  // Create system settings
  console.log("\n⚙️  Creating system settings...");
  const settings = [
    { key: "site_name", value: "NESK Help Desk", category: "general" },
    {
      key: "support_email",
      value: "support@nesk.example.com",
      category: "general",
    },
    { key: "timezone", value: "America/New_York", category: "general" },
    { key: "smtp_host", value: "smtp.example.com", category: "email" },
    { key: "smtp_port", value: "587", category: "email" },
    { key: "from_email", value: "noreply@nesk.example.com", category: "email" },
    { key: "from_name", value: "NESK Support", category: "email" },
    {
      key: "enable_email_notifications",
      value: "true",
      category: "notifications",
    },
    {
      key: "enable_sms_notifications",
      value: "false",
      category: "notifications",
    },
    { key: "response_time_hours", value: "24", category: "sla" },
    { key: "resolution_time_hours", value: "72", category: "sla" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, category: setting.category },
      create: setting,
    });
    console.log(`  ✓ ${setting.key}: ${setting.value}`);
  }

  // Create email templates
  console.log("\n📧 Creating email templates...");
  const emailTemplates = [
    {
      name: "new_ticket_confirmation",
      subject: "Ticket #{{ticketId}} Created - {{subject}}",
      body: `Hello {{customerName}},

Thank you for contacting us. Your support ticket has been created.

Ticket ID: {{ticketId}}
Subject: {{subject}}
Status: Open

We'll review your request and get back to you within {{responseTime}} hours.

You can track your ticket status at: {{ticketUrl}}

Best regards,
{{supportTeam}}`,
      variables: JSON.stringify([
        "ticketId",
        "customerName",
        "subject",
        "responseTime",
        "ticketUrl",
        "supportTeam",
      ]),
      description: "Sent when a customer creates a new ticket",
    },
    {
      name: "ticket_update",
      subject: "Update on Ticket #{{ticketId}}",
      body: `Hello {{customerName}},

There's an update on your support ticket.

Ticket ID: {{ticketId}}
Status: {{status}}

{{message}}

View ticket: {{ticketUrl}}

Best regards,
{{supportTeam}}`,
      variables: JSON.stringify([
        "ticketId",
        "customerName",
        "status",
        "message",
        "ticketUrl",
        "supportTeam",
      ]),
      description: "Sent when a ticket is updated",
    },
    {
      name: "ticket_resolved",
      subject: "Ticket #{{ticketId}} Resolved",
      body: `Hello {{customerName}},

Great news! Your support ticket has been resolved.

Ticket ID: {{ticketId}}
Subject: {{subject}}
Resolution: {{resolution}}

If you're satisfied with the resolution, you can close this ticket. If you need further assistance, feel free to reply.

View ticket: {{ticketUrl}}

Best regards,
{{supportTeam}}`,
      variables: JSON.stringify([
        "ticketId",
        "customerName",
        "subject",
        "resolution",
        "ticketUrl",
        "supportTeam",
      ]),
      description: "Sent when a ticket is marked as resolved",
    },
  ];

  for (const template of emailTemplates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
    console.log(`  ✓ ${template.name}`);
  }

  console.log("\n✨ Database seeding completed successfully!\n");
  console.log("Summary:");
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${priorities.length} priority levels`);
  console.log(`  - ${teamMembers.length} team members`);
  console.log(`  - ${articleCount} KB articles`);
  console.log(`  - ${demoUsers.length} demo users`);
  console.log(`  - ${tickets.length} demo tickets`);
  console.log(`  - ${settings.length} system settings`);
  console.log(`  - ${emailTemplates.length} email templates\n`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
