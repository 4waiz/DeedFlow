# DeedFlow

**AI-powered transaction orchestration for fractional and tokenized real estate (UAE-ready).**
Think **TurboTax + DocuSign + compliance ops + settlement gating** for high-stakes property workflows like fractional ownership, tokenization pilots, and asset management.

TL;DR
DeedFlow turns complex property deals into a guided, compliant, step-by-step flow with real-time status, strict settlement gating, an audit trail, and post-close automation (cap table, rent, maintenance, governance).

## TL;DR

**DeedFlow turns complex fractional and tokenized property deals into a guided, compliant, step-by-step workflow with an audit trail and post-sale automation (rent distribution, maintenance, governance).**

Key Features
🧭 Dashboard & Deal Management
Deal list with status (Draft / Active / Hold / Completed)
Real-time compliance and blocker visibility
Multi-deal switching + demo mode

## Why this matters

Fractional and tokenized real estate sounds simple, but real transactions are messy and high-risk:

* Document collection and verification (IDs, title deed, KYC/AML)
* Approvals and NOCs
* Valuation refresh and pricing updates
* Escrow and settlement steps
* Post-sale ops: rent distribution, maintenance responsibility, management handover
* Governance rules for decision-making and handover

People drop off because it is confusing, slow, and stressful.

🏠 My Property (Market Analysis)
Property overview + ownership breakdown
Market comparison charts (demo data)
Yield/rent snapshot and operational status

## What DeedFlow does

DeedFlow is a workflow agent that orchestrates the deal end-to-end:

* Creates a fractional listing (splits into shares or tokens)
* Generates a compliance checklist with "why it matters" explanations
* Collects and validates docs (mocked for demo)
* Enforces settlement gates (cannot close until required steps are green)
* Produces an audit trail for compliance review
* Automates post-close logic (rent, maintenance, governance)

Upload a document
Upload a mock doc → see extraction + updated status
Watch the gate change
Resolve blockers → settlement status moves toward “Ready”
Post-close automation
View cap table + rent distribution + governance/maintenance routing

## Core features

1. Deal cockpit workflow timeline
2. Document vault and extraction (demo)
3. Settlement gating (compliance-first)
4. Governance logic (configurable)
5. Post-close automation

Workflow steps include:

1. Identity and KYC/AML
2. Title deed verification
3. Required NOCs and approvals
4. Valuation refresh
5. Escrow and settlement
6. Share or token issuance and cap table
7. Post-close: rent, maintenance, governance

GitHub: https://github.com/4waiz/DeedFlow

## Demo walkthrough (2-3 mins)

1. Create a fractional listing
2. Show the workflow cockpit and missing items
3. Upload a mock document and show extracted fields
4. Show the settlement gate (cannot close until compliant)
5. Show post-close panel (rent, maintenance, governance)

---

## Target users

* Developers launching fractional units
* Tokenization platforms
* Asset managers and family offices
* Government and pilot partners

---

## Architecture (simple)

* Frontend: deal dashboard, workflow timeline, document vault
* Orchestration layer: rules engine and agent prompts to guide steps
* Audit log: every action and decision recorded for compliance review
* Demo mock connectors: simulated verification and approvals

---

## Environment Variables

Copy `.env.example` to `.env` and set values.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase **Session Pooler** URL (IPv4-compatible) used by Prisma Client at runtime |
| `DIRECT_URL` | Supabase **Direct** Postgres URL used by Prisma migrations (`prisma migrate ...`) |
| `NEXTAUTH_URL` | Base app URL for auth callbacks |
| `NEXTAUTH_SECRET` | Secret used to sign auth sessions |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `DEMO_MODE` | Enables demo-only seeding and simulation UI |
| `NEXT_PUBLIC_DEMO_MODE` | Client-side demo feature gating |
| `S3_REGION` | S3 bucket region |
| `S3_BUCKET` | S3 bucket name for documents/exports |
| `S3_ACCESS_KEY_ID` | S3 access key ID |
| `S3_SECRET_ACCESS_KEY` | S3 secret access key |
| `S3_ENDPOINT` | Optional custom S3-compatible endpoint |
| `S3_FORCE_PATH_STYLE` | `true` for some S3-compatible providers |
| `S3_PUBLIC_BASE_URL` | Optional public base URL for generated assets |
| `GROQ_API_KEY` | Optional key for OCR extraction enhancement |
| `GROQ_CHAT_API_KEY` | Optional key for chat endpoint |
| `LINGODOTDEV_API_KEY` | Optional key for translation endpoint |

Supabase connectivity notes:

1. Use pooler (`DATABASE_URL`) for app/runtime because it is typically IPv4-compatible.
2. Use direct host (`DIRECT_URL`) for schema migrations when your network supports it.
3. If direct host is unreachable (`P1001`), set `DIRECT_URL` to `DATABASE_URL` temporarily or follow `docs/runbook-dev.md`.

NextAuth deployment notes (Vercel):

1. Set `NEXTAUTH_URL` to your production domain (for example `https://your-app.vercel.app`).
2. Set `NEXTAUTH_SECRET` in Vercel project environment variables.
3. In Google Cloud OAuth settings, include callback URI: `https://<your-domain>/api/auth/callback/google`.

---

## Hackathon mode notes

* Demo uses synthetic data (mock docs, simulated steps).
* Built to be API-ready for real integrations.

Integration targets:

* Identity and KYC providers
* Government approvals and NOC systems
* Payment rails and escrow providers
* Token issuance, custody, and cap table sync

---

## Future roadmap

* Real KYC/AML and document verification integrations
* E-signature and regulator-ready compliance reports
* Live settlement rails and escrow provider integration
* On-chain and off-chain cap table sync and custody integrations
* Multi-language (EN/AR) for UAE workflows

---

## Team

* Awaiz Ahmed (Leader)
* Nikhil Mundhra
* Bilal Khan
* Mohammad Umar

---

## Links

* GitHub repo: https://github.com/4waiz/DeedFlow

---

## License

MIT
