# AGENTS.md

Help-desk app (NESK) built on Next.js 16 App Router + React 19 + Prisma 7 + Better Auth.
Use **Bun** as the package manager and runtime for all scripts.

## Commands

- `bun dev` — start Next.js dev server (http://localhost:3000)
- `bun run build` — production build (also acts as the typecheck; there is no separate `typecheck` script)
- `bun run lint` — `biome check` (lint + format check, does not auto-fix)
- `bun run format` — `biome format --write` (auto-fix formatting only)
- `bun run db:generate` — regenerate Prisma client (also runs on `bun install` via `postinstall`)
- `bun run db:push` — push schema to the database (dev workflow)
- `bun run db:migrate` — create a Prisma migration
- `bun run db:studio` — Prisma Studio GUI
- `bun run db:seed` — `bunx tsx src/prisma/seed.ts`
- `bun run db:dev` — start Prisma's bundled local Postgres on ports 51213-51215 (run in a separate terminal; needed only if `DATABASE_URL` points at the local Prisma dev DB)

There is **no test framework** configured. Do not invent test commands.

## Database / Prisma

- Schema lives at `src/prisma/schema.prisma` (NOT the default root `prisma/`). Path is set in `prisma.config.ts`.
- The generator outputs to `src/prisma/generated/`. Code imports it as `@/prisma/generated/client` — always import `PrismaClient` from there, never `@prisma/client`.
- The generated client is **committed** and regenerated on install. The `.gitignore` line `/src/generated/*` does NOT cover `src/prisma/generated/*`.
- Prisma 7 uses a driver adapter: `src/lib/prisma.ts` builds a `PrismaClient` from a `pg` `Pool` + `@prisma/adapter-pg`. The schema `datasource db` has no `url` field — the URL comes from `prisma.config.ts` reading `DATABASE_URL`.
- After any `schema.prisma` change: `bun run db:push && bun run db:generate`.

## Auth (Better Auth)

- Server config: `src/lib/auth.ts`. Client hooks (`signIn`, `signOut`, `useSession`): `src/lib/auth-client.ts`.
- Better Auth route handler: `src/app/api/auth/[...all]/route.ts`. Auth endpoints live under `/api/auth/*`.
- The `User.role` additional field is declared with `input: false` for security — never let client input set the role.
- `DISABLE_SIGNUP=true` (env) disables sign-up at the auth layer.
- In dev, password-reset emails are console-logged, not sent. Real email sending requires `RESEND_API_KEY`.

## Layout conventions

- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- Server Actions live in `src/app/actions/` (one file per domain: `tickets.ts`, `kb.ts`, `staff.ts`, `admin.ts`, `password-reset.ts`).
- Route groups: `src/app/{admin,staff,auth,tickets,kb,api}`. `src/components/` for shared React, `src/lib/` for utilities/config, `src/locales/` for i18n JSON, `src/types/` for hand-written types.
- Tailwind v4 via `@tailwindcss/postcss`; global styles in `src/app/globals.css`. Theme via `next-themes` (`attribute="data-mode"`). i18n via `src/lib/i18n.tsx` (client) and `src/lib/i18n-server.ts` (server-side locale from cookie / Accept-Language).

## Environment

- `.env` is gitignored and not tracked. Required vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Optional: `RESEND_API_KEY`, `SUPPORT_EMAIL`, `NEXT_PUBLIC_URL`, `DISABLE_SIGNUP`.
- `README.md` references a `.env.example` that does **not** exist; do not rely on it.

## Style

- Biome handles lint + format (2-space indent). Run `bun run lint` before finishing work; `bun run format` to auto-fix formatting.
- TypeScript strict mode. No comments unless asked.

## Note on docs

`README.md`, `SETUP.md`, and `PROJECT_STATUS.md` describe a `src/generated/client/` path, a middleware file, and a `CLAUDE.md` — none of these currently exist in the tree. Trust the code/config above over those docs where they disagree.
