<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PivotAI — Agentic AI Career Development Platform

> Transformed from a static Gemini AI app into a full **multi-agent autonomous system** powered by a Plan-Execute-Reflect orchestration loop.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT ORCHESTRATOR                    │
│              (Plan → Execute → Reflect loop)             │
└──────────────────────┬──────────────────────────────────┘
                       │ spawns & coordinates
        ┌──────────────┼──────────────────────┐
        ▼              ▼                       ▼
┌──────────────┐ ┌──────────────┐   ┌──────────────────┐
│   Career     │ │   Resume     │   │   Interview      │
│  Strategist  │ │   Expert     │   │     Coach        │
└──────────────┘ └──────────────┘   └──────────────────┘
        ┌──────────────┼──────────────────────┐
        ▼              ▼                       ▼
┌──────────────┐ ┌──────────────┐   ┌──────────────────┐
│    Skill     │ │    Job       │   │     Agent        │
│   Analyst    │ │   Matcher    │   │     Memory       │
└──────────────┘ └──────────────┘   └──────────────────┘
```

## Agentic Features

- **Plan-Execute-Reflect Loop** — Orchestrator decomposes goals into multi-step plans, executes with specialized agents, and reflects to improve
- **6 Specialized Agents** — Career Strategist, Resume Expert, Interview Coach, Skill Analyst, Job Matcher, Orchestrator
- **Persistent Agent Memory** — 4 memory types: episodic, semantic, procedural, working; persisted across sessions
- **Streaming Responses** — Real-time SSE streaming of agent reasoning and results
- **Task Queue** — Priority-managed parallel task execution (critical/high/medium/low)
- **Displacement Risk Analysis** — AI-powered assessment of automation risk for current role
- **ATS Resume Optimization** — Keyword injection, power-verb rewriting, score tracking

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui |
| Backend | Express + tRPC 11 (end-to-end type safety) |
| Database | MySQL/TiDB via Drizzle ORM (8 tables) |
| AI | Vercel AI SDK — streaming, tool use, multi-step agents |
| Auth | Manus OAuth with JWT session cookies |

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Auth, roles (user/admin) |
| `careerProfiles` | Skills, goals, displacement risk |
| `agentSessions` | Session lifecycle (pending→planning→executing→reflecting→completed) |
| `agentTasks` | Task queue with priority and status |
| `agentMessages` | Conversation history + thinking steps |
| `agentMemory` | Persistent context (episodic/semantic/procedural/working) |
| `resumeVersions` | Resume history with ATS scores and keywords |
| `jobMatches` | Agent-curated job matches with fit scores |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, agent showcase, CTA |
| `/dashboard` | Dashboard | Agent status, metrics overview |
| `/agent` | Command Center | Natural language goal input + streaming |
| `/agent/:id` | Session Detail | Task queue, messages, progress |
| `/career` | Career Profile | Displacement risk, skills, goals |
| `/resume` | Resume Expert | ATS optimization, version history |
| `/jobs` | Job Matcher | Agent-curated matches |
| `/interview` | Interview Coach | STAR stories, mock interviews |
| `/skills` | Skill Analyst | Gap analysis, learning roadmaps |
| `/memory` | Agent Memory | Past sessions, memory entries |

## Run Locally (Agentic Platform)

**Prerequisites:** Node.js 22+, pnpm

```bash
pnpm install
pnpm db:push     # Run migrations
pnpm dev         # Start dev server on :3000
pnpm test        # Run 27 vitest tests
```

## Environment Variables

```
DATABASE_URL=           # MySQL/TiDB connection string
JWT_SECRET=             # Session signing secret
BUILT_IN_FORGE_API_KEY= # LLM API key (server-side)
BUILT_IN_FORGE_API_URL= # LLM API base URL
```

---

Built with the Manus Agentic Platform · Powered by Vercel AI SDK
