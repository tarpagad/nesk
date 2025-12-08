<div align="center">
  <h1>🎫 NESK Help Desk</h1>
  <p><strong>Enterprise-Grade Customer Support Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-7.1-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  </p>

  <p>
    A modern, full-stack help desk system built with cutting-edge technologies.<br/>
    Featuring real-time ticket management, knowledge base, and comprehensive admin controls.
  </p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-screenshots">Screenshots</a>
  </p>
</div>

---

## ✨ Features

### 🎯 Core Functionality
- **Multi-Role System** - User, Staff, and Admin roles with granular permissions
- **Smart Ticket Management** - Priority-based routing, status tracking, and rich-text responses
- **Knowledge Base** - Searchable, categorized articles with draft/published workflow
- **Real-Time Updates** - Server Actions for instant UI updates without page reloads
- **Rich Text Editor** - Full-featured WYSIWYG editor with React Quill integration
- **Dark/Light Theme** - System preference detection with user override and persistent storage

### 👥 User Portal
- Ticket submission with file attachments
- Real-time ticket status tracking
- Searchable knowledge base
- Ticket history and thread views

### 🛠️ Staff Dashboard
- Unified ticket queue with advanced filtering
- Inline ticket management (status, priority, assignment)
- Knowledge base article authoring
- Customer communication tools

### ⚙️ Admin Panel
- **Team Management** - User roles, permissions, and email verification
- **System Settings** - Configurable business rules and email templates
- **Analytics & Reporting** - Ticket metrics, response times, and performance KPIs
- **Category Management** - Organize tickets and KB articles
- **Email Templates** - Customizable notification templates

### 🔐 Security & Auth
- **Better Auth** integration for secure authentication
- Password reset flow with email verification
- Session management with role-based access control
- Protected routes and API endpoints

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16** (App Router, Turbopack, Server Components)
- **React 19** (Latest features including Server Actions)
- **TypeScript 5** (Type safety across the stack)
- **Tailwind CSS v4** (Utility-first styling)
- **React Quill** (Rich text editing)
- **next-themes** (Dark/Light mode support)

### Backend
- **Next.js API Routes** (RESTful endpoints)
- **Server Actions** (Type-safe mutations)
- **Better Auth 1.4** (Authentication & authorization)
- **Prisma ORM 7.1** (Type-safe database client)

### Database & Infrastructure
- **PostgreSQL** (Primary database)
- **Prisma Migrations** (Schema versioning)
- **Bun** (Fast package manager and runtime)

### Developer Experience
- **Biome** (Lightning-fast linting & formatting)
- **TypeScript strict mode** (Maximum type safety)
- **Prisma Studio** (Database GUI)

---

## 🏃 Quick Start

### Prerequisites
```bash
node >= 18.17.0
bun >= 1.0.0 (or npm/yarn/pnpm)
postgresql >= 14
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tarpagad/nesk.git
cd nesk
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nesk"

# Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email (Optional - defaults to console logging in dev)
RESEND_API_KEY="your-resend-api-key"

# PUBLIC URL
NEXT_PUBLIC_BETTER_AUTH_URL="your-deployed-public-url"
```

4. **Initialize the database**
```bash
# Generate Prisma client
bun run db:generate

# Push schema to database
bun run db:push

# Seed with sample data
bun run db:seed
```

5. **Start the development server**
```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

### Default Users (from seed data)
```
Admin: admin@nesk.example.com
Staff: sarah.tech@nesk.example.com
Staff: mike.support@nesk.example.com
```
*Note: Create passwords via signup flow or update roles in Prisma Studio*

---

## 🏗️ Architecture

### Project Structure
```
nesk/
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions (type-safe mutations)
│   │   ├── admin/            # Admin panel pages
│   │   ├── staff/            # Staff dashboard pages
│   │   ├── auth/             # Authentication flows
│   │   ├── tickets/          # Public ticket pages
│   │   ├── kb/               # Knowledge base
│   │   └── api/              # API routes
│   ├── components/           # Reusable React components
│   ├── lib/                  # Utilities & configurations
│   │   ├── auth.ts           # Better Auth setup
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── email.ts          # Email service
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Sample data seeder
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── prisma.config.ts          # Prisma configuration
```

### Key Design Patterns
- **Server Components** - Default for data fetching and SEO
- **Client Components** - Interactive UI with "use client" directive
- **Server Actions** - Type-safe form submissions and mutations
- **Route Handlers** - RESTful API endpoints for Better Auth
- **Middleware** - Session validation and route protection

### Database Schema Highlights
```prisma
User (Better Auth)
├── Tickets (Customer support requests)
├── Accounts (OAuth providers)
└── Sessions (Active user sessions)

Ticket
├── Category (Categorization)
├── Priority (Urgency levels)
└── TicketReply (Conversation threads)

KbArticle (Knowledge base)
├── Category
└── TeamMember (Author)

Settings (System configuration)
EmailTemplate (Notification templates)
```

---

## 🏗️ Routes & Navigation

### Public Routes
- `/` - Homepage with KB search and ticket submission
- `/kb` - Knowledge base articles listing
- `/kb/[id]` - View individual KB article
- `/tickets/submit` - Submit new support ticket
- `/tickets/status` - Check ticket status by ID and email

### Authentication Routes
- `/auth/signin` - User login
- `/auth/signup` - User registration
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Set new password

### Staff Portal (Protected)
- `/staff` - Dashboard with ticket overview and statistics
- `/staff/tickets` - All tickets with filtering and search
- `/staff/tickets/[id]` - Individual ticket view and management
- `/staff/kb` - Knowledge base management
- `/staff/kb/new` - Create new KB article
- `/staff/kb/edit/[id]` - Edit existing KB article

### Admin Panel (Protected)
- `/admin` - Admin dashboard with analytics
- `/admin/team` - Team member management (roles, permissions)
- `/admin/categories` - Ticket and KB category management
- `/admin/email-templates` - Email notification templates
- `/admin/settings` - System configuration (email, security, etc.)
- `/admin/reports` - Performance analytics and metrics

---

## 📊 Database Schema

### Core Models
- **User** - Customer accounts (with Better Auth)
- **TeamMember** - Staff user accounts (email, name, role)
- **Ticket** - Support tickets (status, priority, category, replies)
- **TicketReply** - Ticket messages and notes (internal/public)
- **TicketAttachment** - File attachments on tickets
- **KbArticle** - Knowledge base articles (title, content, keywords, status)
- **Category** - Categorization for tickets and KB articles
- **Priority** - Ticket priority levels (Low, Medium, High, Critical)
- **Settings** - System configuration (key-value pairs)
- **EmailTemplate** - Customizable email notification templates

### Database Commands

```bash
# Generate Prisma Client
bun run db:generate

# Create migration
bun run db:migrate

# Push schema (dev only)
bun run db:push

# Open Prisma Studio (GUI)
bun run db:studio

# Seed database with sample data
bun run db:seed
```

---

### 🎨 Development Workflow

### Theme Management
The application includes built-in dark/light theme support powered by `next-themes`:
- **Theme Toggle**: Located in the top navbar on all pages
- **Persistence**: User preference is saved to localStorage
- **System Detection**: Defaults to OS preference (dark/light) on first visit
- **Override**: Users can manually toggle theme which persists across sessions
- **Coverage**: All pages, components, and custom styles support both themes

### Code Quality
```bash
# Lint & format check
bun run lint

# Auto-fix formatting
bun run format
```

### Environment-Specific Configs
- **Development**: Console logging for emails, hot reload enabled
- **Production**: Real email sending via Resend, optimized builds

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ CSRF protection via Better Auth
- ✅ SQL injection prevention via Prisma
- ✅ XSS protection via React's built-in escaping
- ✅ Role-based access control (RBAC)
- ✅ Secure session management
- ✅ Email verification workflow
- ✅ Password reset with token expiration

---

## 🚢 Deployment

### Recommended Platforms
- **Vercel** - Zero-config deployment for Next.js
- **Railway** - Simple PostgreSQL hosting
- **Render** - Full-stack deployments
- **Fly.io** - Global edge deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set secure `BETTER_AUTH_SECRET`
- [ ] Enable real email sending (Resend API key)
- [ ] Run database migrations
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets

---

## 🤝 Contributing

Contributions are welcome! This project demonstrates:
- Modern Next.js 16 patterns
- Production-grade TypeScript
- Clean architecture principles
- Comprehensive feature implementation

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 📝 Implementation Highlights

### Phase 1: Foundation ✅
- Next.js 16 with App Router setup
- PostgreSQL + Prisma ORM configuration
- Tailwind CSS v4 + shadcn/ui components

### Phase 2: Customer Portal ✅
- Ticket submission and tracking
- Knowledge base with search and categories
- Email notifications (Resend integration)

### Phase 3: Staff Portal ✅
- Authentication system (Better Auth)
- Ticket management dashboard
- Knowledge base management
- Team collaboration features

### Phase 4: Admin Features ✅
- Role-based access control (Admin, Agent, User)
- Team member management
- Email template customization
- System settings and configuration
- Analytics and reporting dashboard

### Phase 5: Dark/Light Theme ✅
- System preference detection
- Theme toggle with persistent storage
- Full application coverage

### Phase 6: Coming Soon
- File attachments (Cloudflare R2)
- SLA tracking and automation
- Customer satisfaction surveys
- Multi-language support

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [Better Auth](https://better-auth.com) - Authentication
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [React Quill](https://github.com/zenoamaro/react-quill) - Rich text editor

---

<div align="center">
  <p>Made with ❤️ using Next.js 16 and React 19</p>
  <p>
    <a href="https://github.com/tarpagad/nesk">⭐ Star this repo</a> if you find it useful!
  </p>
</div>
