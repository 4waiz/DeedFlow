DeedFlow 🧾🌊

AI-powered transaction orchestration for fractional & tokenized real estate (UAE-ready).
Think TurboTax + DocuSign + compliance ops + settlement gating — built for high-stakes workflows: fractional ownership, tokenization pilots, and asset administration.

TL;DR
DeedFlow turns complex property deals into a guided, compliant, step-by-step flow with real-time status, strict settlement gating, an audit trail, and post-close automation (cap table, rent, maintenance, governance).

Problem
Fractional/tokenized real estate sounds simple — but execution is messy and high-risk:
Document collection + verification (IDs, title deed, KYC/AML)
Approvals / NOCs
Valuation checkpoints & pricing updates
Escrow + settlement sequencing
Post-sale operations (rent distribution, maintenance responsibility)
Governance rules (majority control, approvals, handover)
Deals fail because the process is confusing, slow, and stressful — and no one has a single source of truth.

Solution
DeedFlow is a workflow agent + deal cockpit that orchestrates the deal end-to-end:
✅ Creates a deal (fractional / tokenized mode)
✅ Builds a compliance checklist with “why it matters”
✅ Collects + validates docs (demo = mocked extraction/verification)
✅ Enforces settlement gating (cannot close until compliant)
✅ Geerates an audit trail (every action logged)
✅ Automates post-close administration (cap table, rent, maintenance, governance)

Key Features
🧭 Dashboard & Deal Management
Deal list with status (Draft / Active / Hold / Completed)
Real-time compliance and blocker visibility
Multi-deal switching + demo mode

✅ Deal Cockpit Workflow (Left → Right)
Left: workflow timeline (KYC → Title → NOCs → Valuation → Escrow → Settlement → Post-close)
Right: compliance copilot + actions (request docs, upload docs, resolve blockers)
Main: documents, governance, activity/audit, and deal metrics

📁 Document Vault + Extraction (Demo)
Upload mock documents → extract key fields → detect missing items
Status: Missing / Uploaded / Verified / Rejected
Step-to-doc mapping (requiredDocs per workflow step)

🛑 Settlement Gating (Compliance-First)
“Ready to settle” is locked until required steps are green
Blocker explained with actionable next steps

🗳️ Governance + Post-Close Automation
Cap table generation (shares/tokens ownership)
Pro-rata rent distribution (demo)
Maintenance responsibility workflow
Configurable governance rules (majority proposals, supermajority approvals)

🏠 My Property (Market Analysis)
Property overview + ownership breakdown
Market comparison charts (demo data)
Yield/rent snapshot and operational status

⚙️ Settings & Personalization
Language: EN / AR
Theme / UI preferences
Account profile (demo)

🌍 Multi-language Support
English / Arabic UI support via i18n routing/utilities
How to Use (2–3 min Demo Flow)

Open a deal
Select an Active deal from the sidebar
See what’s blocked
Check Copilot + workflow timeline for missing docs/steps

Upload a document
Upload a mock doc → see extraction + updated status
Watch the gate change
Resolve blockers → settlement status moves toward “Ready”
Post-close automation
View cap table + rent distribution + governance/maintenance routing

Architecture
Tech Stack
Frontend: Next.js (App Router) + TypeScript + Tailwind
State: Zustand
API Routes (demo): Next.js route handlers (mock connectors)
i18n: EN/AR support
Data: mock-data seeded deals + docs + audit

Project Structure (High Level)
src/app/ — routes (/, /about, /judge, API)
src/components/ — UI components (TopBar, DealPicker, DealTimeline, DocsPanel, AgentPanel, AuditFeed, etc.)
src/lib/ — types, store, mock data, i18n utilities

Demo Connectors (Mocked)
Designed to plug into real providers later:
KYC/AML verification
NOC/approval systems
Escrow/settlement rails
Token issuance/custody platforms
Security & Privacy (Demo Notes)
Demo uses synthetic data
No real IDs or private documents required
Audit trail shown for compliance behavior (not legal advice)

Roadmap

Phase 1 ✅ (Hackathon MVP)
Deal cockpit + timeline + doc vault
Copilot recommendations + settlement gating
Audit feed + post-close automation (demo)

Phase 2 🔄

Real KYC/doc verification integrations
Regulator-ready exportable compliance reports
Role-based access (developer / compliance / regulator)

Phase 3 🚀

Escrow + settlement provider integration
On-chain/off-chain cap table sync + custody
Multi-entity workflows + production hardening

Team

Awaiz Ahmed
Mohammad Umar
Nikhil Mundarh
Bilal Feroz


Repo

GitHub: https://github.com/4waiz/DeedFlow

License

MIT
