# PivotAI Agentic — Project TODO

## Database & Schema
- [x] Users table (base, already exists)
- [x] Agent sessions table (session state, goal, status)
- [x] Agent tasks table (task queue with priority, status, type)
- [x] Agent messages table (streaming messages, thinking steps)
- [x] Agent memory table (persistent context, embeddings key-value)
- [x] Career profiles table (user career data, skills, goals)
- [x] Job matches table (cached job match results)
- [x] Resume versions table (resume history)
- [x] Database migrations pushed (TiDB compatible)

## Agentic Backend
- [x] Agent orchestrator service (Plan-Execute-Reflect loop with streaming)
- [x] Career Strategist agent (goal decomposition, path planning)
- [x] Resume Expert agent (resume optimization tool)
- [x] Interview Coach agent (interview simulation tool)
- [x] Skill Analyst agent (skill gap analysis tool)
- [x] Job Matcher agent (job matching tool)
- [x] Agent memory service (read/write persistent context)
- [x] Streaming SSE endpoint for real-time agent output (/api/agent/stream)
- [x] tRPC router: agent.startSession
- [x] tRPC router: agent.getSession
- [x] tRPC router: agent.listSessions
- [x] tRPC router: agent.getTaskQueue
- [x] tRPC router: agent.getMemory
- [x] tRPC router: agent.getMemoryContext
- [x] tRPC router: career.getProfile
- [x] tRPC router: career.updateProfile
- [x] tRPC router: resume.getVersions
- [x] tRPC router: resume.saveVersion
- [x] tRPC router: jobs.getMatches
- [x] tRPC router: jobs.saveMatches

## Frontend — Landing Page
- [x] Hero section with animated agent visualization
- [x] Feature highlights (multi-agent, streaming, memory)
- [x] Agent demo preview section
- [x] CTA to get started / login

## Frontend — Agent Command Center (Main App)
- [x] AgentLayout with sidebar navigation (dark agentic design)
- [x] Natural language goal input interface
- [x] Real-time agent status dashboard (active agents, task queue)
- [x] Agent reasoning panel (visible thinking steps)
- [x] Streaming response display with markdown rendering
- [x] Agent collaboration timeline (which agent is doing what)
- [x] Task queue management UI (priority, status)

## Frontend — Specialized Pages
- [x] Dashboard page (agent status overview, metrics)
- [x] Career Profile setup page (displacement risk, skills, goals)
- [x] Resume Expert page (ATS score, version history)
- [x] Interview Coach page (STAR stories, mock interview)
- [x] Skill Analyst page (gap analysis, learning roadmaps)
- [x] Job Matcher page (agent-curated job matches)
- [x] Agent Memory page (past sessions, memory entries)
- [x] Agent Session detail page (tasks, messages, progress)

## Testing
- [x] Vitest: auth logout tests (cookie clearing)
- [x] Vitest: career profile router tests (get/update, auth guards)
- [x] Vitest: agent session router tests (list/get)
- [x] Vitest: resume router tests (get/save)
- [x] Vitest: jobs router tests (get/save)
- [x] Vitest: agent orchestrator logic tests (goal decomposition, priorities)
- [x] Vitest: Plan-Execute-Reflect cycle tests (plan structure, thinking steps)
- [x] All 27 tests passing

## Deployment
- [ ] Checkpoint saved
- [ ] Pushed to GitHub (dainantonio/PivotAI)
