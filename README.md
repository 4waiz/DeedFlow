# DeedFlow

**AI-Powered Property Compliance for UAE Fractional/Tokenized Real Estate**

DeedFlow is an AI agent that turns fractional and tokenized property transactions into a guided, compliant workflow — purpose-built for the UAE real estate ecosystem.

Think: TurboTax + DocuSign + compliance ops + settlement gating for fractional real estate.

## Quick Start

```bash
npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Fractional Listing Creation** — Create deals with shares/tokens, parties, and governance rules
- **8-Step Compliance Workflow** — KYC/AML, Title Deed, NOC, Valuation, Escrow, Settlement, Issuance, Post-Close
- **AI Compliance Copilot** — Real-time recommendations: PROCEED / HOLD / ESCALATE
- **Document Upload & Extraction** — Mock parsing with extracted fields and verification status
- **51% Governance Engine** — Automatic majority control detection with management handover
- **Post-Close Automation** — Pro-rata rent distribution and maintenance responsibility
- **Live Activity Feed** — Audit trail with UAE-flavored microcopy
- **Bilingual EN/AR** — Full Arabic localization with RTL support
- **Demo Script** — 90-second guided walkthrough with auto-play
- **Live Simulation** — Auto-updates every ~15 seconds + manual event triggers

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — single-page cockpit with deal picker, timeline, docs, copilot, governance, and audit feed |
| `/about` | Story page — Adaptive City relevance, principles, and roadmap |
| `/judge` | Judge View — problem, solution, why UAE now, live metrics, and quick links |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/deals` | List all deals (summary) |
| GET | `/api/deals/[id]` | Get deal details |
| POST | `/api/deals` | Create a new deal |
| POST | `/api/docs/upload` | Upload mock document with extraction |
| POST | `/api/steps/complete` | Mark step as completed (with gating) |
| POST | `/api/simulate` | Trigger simulation events |
| POST | `/api/translate` | EN/AR translation (Lingo.dev or mock) |

## Simulation Events

Use the "Simulate Event" dropdown in the top bar:
- **Complete Step** — Advances the workflow timeline
- **Verify Document** — Marks a pending doc as verified
- **Missing Doc** — Blocks a step due to missing documentation
- **NOC Delay** — Developer NOC processing delay
- **51% Flip** — Buyer crosses majority threshold
- **Risk Surge** — Spike in risk score
- **Approval Delay** — Regulatory approval delay

## Lingo.dev Integration (Optional)

For full translation support, add a Lingo.dev API key:

```bash
LINGO_API_KEY=your_key_here
```

Without the key, the app uses a mock translator that works perfectly for the demo.

The integration is used in three ways:
1. **Static UI localization** — All main UI strings switch EN/AR
2. **Dynamic content translation** — User notes get translated with original + translated display
3. **Multilingual agent** — Compliance Copilot recommendations show in selected language

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS with custom UAE theme (emerald + gold + desert)
- shadcn/ui patterns + Lucide React icons
- Framer Motion for micro-animations
- Recharts for forecast charts
- Zustand for state management
- canvas-confetti for celebrations
- No auth, no DB — all in-memory mock data

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── deals/          # Deal CRUD endpoints
│   │   ├── docs/upload/    # Document upload + extraction
│   │   ├── simulate/       # Event simulation
│   │   ├── steps/complete/ # Step completion with gating
│   │   └── translate/      # EN/AR translation
│   ├── about/              # About/Story page
│   ├── judge/              # Judge view page
│   ├── globals.css         # Global styles + UAE theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard (main page)
├── components/
│   ├── AgentPanel.tsx      # Compliance Copilot
│   ├── AuditFeed.tsx       # Live activity feed + leaderboard
│   ├── ComplianceMeter.tsx # Score/risk meter
│   ├── ConfettiEffect.tsx  # Celebration confetti
│   ├── DealPicker.tsx      # Deal list + create form
│   ├── DealTimeline.tsx    # 8-step workflow timeline
│   ├── DemoScriptModal.tsx # 90-second demo walkthrough
│   ├── DocsPanel.tsx       # Document list + upload
│   ├── ForecastChart.tsx   # Time-to-close forecast chart
│   ├── GovernanceCard.tsx  # 51% majority + rent distribution
│   ├── ToastStack.tsx      # Toast notifications
│   └── TopBar.tsx          # Navigation + controls
└── lib/
    ├── cn.ts               # Tailwind class merge utility
    ├── i18n.ts             # EN/AR translations + mock translator
    ├── mock-data.ts        # Seed deals + leaderboard
    ├── store.ts            # Zustand store + simulation engine
    └── types.ts            # TypeScript data model
```
