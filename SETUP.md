# NESK Setup Guide

## Prerequisites
- Bun installed
- Node.js 20+

## Initial Setup

### 1. Install Dependencies
```bash
bun install
```

### 2. Start Prisma Development Database
In a separate terminal, run:
```bash
bun db:dev
```

This starts a local PostgreSQL server on ports 51213-51215. Keep this running in the background.

### 3. Push Database Schema
In your main terminal:
```bash
bun db:push
```

This will create all the tables in your database based on the Prisma schema.

### 4. Generate Prisma Client
```bash
bun db:generate
```

### 5. Start Development Server
```bash
bun dev
```

Visit `http://localhost:3000`

## Database Management

### View Database (Prisma Studio)
```bash
bun db:studio
```

### Create Migration
```bash
bun db:migrate
```

### Reset Database
```bash
# Stop the Prisma dev server (Ctrl+C)
# Delete the data directory
rm -rf ~/.cache/prisma/default
# Restart Prisma dev server
bun db:dev
# Push schema again
bun db:push
```

## Environment Variables

The `.env` file contains:
- `DATABASE_URL` - PostgreSQL connection string (auto-configured for local dev)
- `BETTER_AUTH_SECRET` - Secret key for Better-Auth (already set)
- `BETTER_AUTH_URL` - Base URL for auth (http://localhost:3000)

## Better-Auth Setup

Better-Auth is fully configured with:
- ✅ Email/Password authentication
- ✅ Session management
- ✅ User roles (default: "user")
- ✅ PostgreSQL database adapter
- ✅ API routes at `/api/auth/*`

### Auth Endpoints

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get current session

### Using Auth in Components

```tsx
'use client';
import { useSession, signIn, signOut } from '@/lib/auth-client';

export function MyComponent() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <div>Loading...</div>;
  
  if (!session) {
    return <button onClick={() => signIn.email({ /* ... */ })}>Sign In</button>;
  }
  
  return (
    <div>
      <p>Welcome {session.user.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

## Database Schema

The project includes:

### Auth Tables (Better-Auth)
- `User` - User accounts with email, name, role
- `Session` - Active user sessions
- `Account` - OAuth/email provider accounts
- `Verification` - Email verification tokens

### Application Tables
- `TeamMember` - Staff members who manage tickets
- `Category` - Categories for tickets and KB articles
- `KbArticle` - Knowledge base articles
- `Priority` - Ticket priority levels
- `Ticket` - Support tickets
- `TicketReply` - Replies to tickets
- `TicketAttachment` - File attachments for tickets

## Next Steps

1. Create a sign-up page at `/auth/signup`
2. Create a sign-in page at `/auth/signin`
3. Implement ticket submission form
4. Build staff dashboard
5. Add KB article management

## Troubleshooting

### "Can't reach database server"
Make sure the Prisma dev server is running:
```bash
bun db:dev
```

### "Prisma Client not generated"
Run:
```bash
bun db:generate
```

### Database schema changes not reflected
After modifying `schema.prisma`:
```bash
bun db:push
bun db:generate
```
