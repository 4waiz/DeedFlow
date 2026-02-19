# DeedFlow Dev Runbook

## Supabase + Prisma URL Setup

Set both URLs in `.env`:

1. `DATABASE_URL`: Supabase **Session Pooler** URL (recommended for Prisma Client runtime, usually IPv4-compatible).
2. `DIRECT_URL`: Supabase **Direct connection** URL (recommended for `prisma migrate` commands).

Example variable names:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

## Pooler vs Direct URL

1. Use `DATABASE_URL` for app runtime queries (`next dev`, API routes, server actions).
2. Use `DIRECT_URL` for migration commands (`prisma migrate dev`, `prisma migrate deploy`).
3. On some networks/Supabase plans, direct host may be unreachable (IPv6 limitations) while pooler remains reachable.

## Migration Fallback If `DIRECT_URL` Is Unreachable

If `npx prisma migrate deploy` fails with `P1001` against `DIRECT_URL`:

1. Preferred fallback: apply SQL from `prisma/migrations/*/migration.sql` in Supabase SQL Editor, in migration order.
2. Temporary fallback (less ideal): point `DIRECT_URL` to the same value as `DATABASE_URL` and run deploy.

PowerShell example:

```powershell
$env:DIRECT_URL = $env:DATABASE_URL
npx prisma migrate deploy
```

Warning: running migrations through poolers can be less reliable for certain migration operations. Use direct DB access when possible.

## Seed Flow

Seed is configured via Prisma:

```bash
npx prisma db seed
```

Behavior:

1. Seed runs only when `DEMO_MODE=true`.
2. Seed creates one demo organization and one sample deal only (idempotent upserts).
3. With `DEMO_MODE=false`, seeding exits without modifying data.

## Standard Local Commands

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```
