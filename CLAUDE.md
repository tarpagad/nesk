# NESK - Help Desk Ticketing System

## Project Overview
A full-featured help desk ticketing system built with Next.js 16 (App Router), PostgreSql with Prisma ORM, Tailwind CSS, and shadcn/ui. This system provides customer ticket submission, staff ticket management, knowledge base, email notifications, categories, and admin panel.

**Tech Stack:**
- Next.js 16 (App Router + Server Actions)
- PostgreSQL
- Prisma ORM
- Better-Auth for authentication
- Tailwind CSS v4 + shadcn/ui
- Zustand for state management
- Brevo for email notifications
- Lucide React icons

## Core Features

### 1. Customer Portal (Public-Facing)
- **Submit Ticket** - Anonymous or authenticated users can submit support tickets
- **View Ticket Status** - Track ticket using ticket ID and email
- **Knowledge Base Search** - Browse articles by category or search keywords
- **Category Browsing** - Organized KB articles by categories

### 2. Staff Portal (Authenticated)
- **Ticket Management**
  - View all tickets (filterable by status, priority, category, date)
  - Assign tickets to team members
  - Update ticket status (Open, In Progress, Waiting for Customer, Resolved, Closed)
  - Add internal notes and public replies
  - Merge duplicate tickets
  - Set priority levels (Low, Medium, High, Critical)
  
- **Knowledge Base Management**
  - Create, edit, publish KB articles
  - Categorize articles
  - Add keywords for search optimization
  - Draft/Published status
  - Version history tracking

- **Team Management**
  - Add/remove team members
  - Assign roles (Admin, Agent, Viewer)
  - Set permissions

### 3. Admin Panel
- **Dashboard & Reports**
  - Ticket statistics (total, open, resolved, response time)
  - Team performance metrics
  - Popular KB articles
  - Customer satisfaction ratings
  
- **Settings**
  - Email templates configuration
  - Category management
  - Custom fields for tickets
  - SLA rules and automation
  - Email integration (Brevo API)

### 4. Email Notifications
- New ticket confirmation (customer)
- Ticket updates notification
- Staff assignment alerts
- Resolution/closure notifications
- Automated responses

## Database Schema

Current Prisma schema includes:

- **User** - Customer accounts (email, name)
- **TeamMember** - Staff accounts (email, name, role)
- **Ticket** - Support tickets (openDate, lastUpdate, status, userId)
- **KbArticle** - Knowledge base articles (title, content, keywords, published, updated, authorId, categoryId)
- **kbArticleCategory** - KB categories (name, parentCatId)

### Planned Schema Additions

```prisma
model TicketReply {
  id         Int      @id @default(autoincrement())
  ticketId   Int
  ticket     Ticket   @relation(fields: [ticketId], references: [id])
  authorId   Int      // TeamMember or User
  authorType String   // "staff" or "customer"
  message    String
  isInternal Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model TicketAttachment {
  id         Int      @id @default(autoincrement())
  ticketId   Int
  ticket     Ticket   @relation(fields: [ticketId], references: [id])
  filename   String
  fileUrl    String   // R2 or external storage
  uploadedAt DateTime @default(now())
}

model Category {
  id       Int      @id @default(autoincrement())
  name     String   @unique
  tickets  Ticket[]
}

model Priority {
  id      Int      @id @default(autoincrement())
  name    String   @unique // Low, Medium, High, Critical
  tickets Ticket[]
}
```

## Pages & Routes

### Public Routes
- `/` - Homepage with KB search and ticket submission
- `/kb` - Knowledge base listing
- `/kb/[category]` - Articles by category
- `/kb/article/[id]` - Individual article view
- `/ticket/submit` - Submit new ticket form
- `/ticket/view` - Check ticket status (requires ticket ID + email)

### Staff Routes (Protected)
- `/staff` - Dashboard (ticket overview, stats)
- `/staff/tickets` - All tickets list
- `/staff/tickets/[id]` - Individual ticket view/edit
- `/staff/kb` - KB management
- `/staff/kb/new` - Create new article
- `/staff/kb/edit/[id]` - Edit article
- `/staff/team` - Team member management

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/settings` - System settings
- `/admin/categories` - Manage categories
- `/admin/reports` - Analytics and reports

## Implementation Phases

### Phase 1: Foundation (Current)
- [x] Next.js 16 setup with Cloudflare Pages
- [x] Database configuration
- [x] Prisma schema with basic models
- [x] Tailwind CSS v4 + shadcn/ui
- [x] Basic KB component

### Phase 2: Customer Portal
- [ ] Ticket submission form with validation
- [ ] Ticket status checker
- [ ] KB article browsing and search
- [ ] Category filtering
- [ ] Email notifications (Brevo integration)

### Phase 3: Staff Portal
- [ ] Authentication system (BetterAuth or NextAuth)
- [ ] Staff dashboard
- [ ] Ticket list with filters
- [ ] Ticket detail view with reply system
- [ ] Internal notes
- [ ] KB article CRUD

### Phase 4: Admin Features
- [ ] Team member management
- [ ] Role-based access control
- [ ] Settings panel
- [ ] Email template editor
- [ ] Reports and analytics

### Phase 5: Advanced Features
- [ ] File attachments (Cloudflare R2)
- [ ] SLA tracking
- [ ] Automated workflows
- [ ] Customer satisfaction surveys
- [ ] Multi-language support

## Environment Variables

```env
# Cloudflare D1
DATABASE_URL="file:./dev.db" # Local development

# Brevo Email API
BREVO_API_KEY="your-api-key"

# Authentication (if using BetterAuth/NextAuth)
AUTH_SECRET="your-secret"
AUTH_URL="http://localhost:3000"
```

## Development Setup

1. Install dependencies: `bun install`
2. Setup D1 database: Follow `howtos/d1_migrations_steps.md`
3. Run migrations: `bunx wrangler d1 migrations apply neskd1 --local`
4. Generate Prisma Client: `bunx prisma generate`
5. Start dev server: `bun dev`

## Deployment (Cloudflare Pages)

1. Build: `bun pages:build`
2. Preview: `bun preview`
3. Deploy: `bun deploy`

## Next Steps

1. Complete Prisma schema with TicketReply, Category, Priority models
2. Implement ticket submission form with Server Actions
3. Build KB search functionality
4. Setup Brevo email integration
5. Create staff authentication flow
6. Build ticket management UI

