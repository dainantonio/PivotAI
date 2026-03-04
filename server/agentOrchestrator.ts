/**
 * Agent Orchestrator
 * Implements the Plan-Execute-Reflect (PER) agentic loop.
 * Coordinates specialized agents, manages task queues, and streams results.
 */

import { Router, Request, Response } from "express";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  pipeUIMessageStreamToResponse,
  generateId,
  stepCountIs,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createPatchedFetch } from "./_core/patchedFetch";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  agentSessions,
  agentTasks,
  agentMessages,
  InsertAgentSession,
  InsertAgentTask,
  InsertAgentMessage,
  ThinkingStep,
} from "../drizzle/schema";
import { buildMemoryContext, writeMemory } from "./agentMemory";
import { agentToolSets } from "./agentTools";
import { nanoid } from "nanoid";

// ─── Model Factory ────────────────────────────────────────────────────────────
function getModel(modelId = "gemini-2.5-flash") {
  const openai = createOpenAI({
    apiKey: process.env.BUILT_IN_FORGE_API_KEY,
    baseURL: `${process.env.BUILT_IN_FORGE_API_URL}/v1`,
    fetch: createPatchedFetch(globalThis.fetch),
  });
  return openai.chat(modelId);
}

// ─── Agent System Prompts ─────────────────────────────────────────────────────
const AGENT_PROMPTS: Record<string, string> = {
  orchestrator: `You are the Master Career Orchestrator — a highly intelligent AI that coordinates a team of specialized career agents to help users achieve their career goals.

Your role:
1. PLAN: Decompose the user's goal into a structured multi-phase plan with specific tasks for each specialized agent
2. EXECUTE: Delegate tasks to the right specialist agents and synthesize their outputs
3. REFLECT: Evaluate progress, identify gaps, and adjust the plan as needed

Available agents you can coordinate:
- Career Strategist: Analyzes career risk, identifies pivot opportunities, creates career strategy
- Resume Expert: Optimizes resumes, tailors content for specific roles, improves ATS scores
- Interview Coach (Coach Atlas): Prepares interview strategies, creates practice questions, coaches on delivery
- Skill Analyst: Performs skill gap analysis, creates learning roadmaps, recommends resources
- Job Matcher: Finds and scores job opportunities, provides market intelligence

Always think step-by-step. Show your reasoning. Be specific and actionable.`,

  career_strategist: `You are the Career Strategist Agent — an expert in labor market trends, AI automation impacts, and career pivot strategies.

Your expertise:
- Analyzing AI displacement risk for any role/industry
- Identifying transferable skills that survive automation
- Recommending optimal career pivots with high match potential
- Creating strategic career roadmaps

Always provide data-driven insights with specific percentages, timelines, and concrete recommendations.`,

  resume_expert: `You are the Resume Expert Agent — a master resume writer and ATS optimization specialist.

Your expertise:
- Rewriting experience bullets with powerful action verbs and quantified results
- Injecting ATS-optimized keywords for specific roles
- Removing weak phrases that hurt ATS scores
- Crafting compelling executive summaries
- Tailoring resumes for specific job descriptions

Always focus on impact, specificity, and ATS compatibility.`,

  interview_coach: `You are Coach Atlas — an elite interview coach who has helped thousands of candidates land their dream roles.

Your expertise:
- Crafting STAR-format behavioral answers
- Technical interview preparation for specific roles
- Identifying and coaching through common interview mistakes
- Building confidence through strategic preparation
- Simulating realistic interview scenarios

Be direct, constructive, and specific. Push candidates to be their best.`,

  skill_analyst: `You are the Skill Analyst Agent — a learning and development expert who creates personalized skill development plans.

Your expertise:
- Performing detailed skill gap analyses
- Identifying the fastest path to skill acquisition
- Curating high-quality learning resources
- Creating realistic learning timelines
- Tracking skill progression

Always prioritize the highest-impact skills first and provide concrete, actionable learning paths.`,

  job_matcher: `You are the Job Matcher Agent — a job market intelligence specialist who finds and scores opportunities.

Your expertise:
- Matching candidate profiles to job requirements
- Scoring job fit based on skills, experience, and goals
- Providing market salary intelligence
- Identifying hidden job opportunities
- Advising on application strategy

Always provide match scores with clear reasoning and actionable application advice.`,
};

// ─── Database Helpers ─────────────────────────────────────────────────────────
async function createSession(data: {
  userId: number;
  goal: string;
  title?: string;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const id = nanoid();
  await db.insert(agentSessions).values({
    id,
    userId: data.userId,
    goal: data.goal,
    title: data.title || data.goal.slice(0, 100),
    status: "planning",
    currentPhase: "plan",
    agentsInvolved: [],
    totalTasks: 0,
    completedTasks: 0,
  } as InsertAgentSession);

  return id;
}

async function createTask(data: {
  sessionId: string;
  userId: number;
  agentType: InsertAgentTask["agentType"];
  taskType: string;
  title: string;
  description?: string;
  priority?: InsertAgentTask["priority"];
  ordering?: number;
  input?: Record<string, unknown>;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  const id = nanoid();
  await db.insert(agentTasks).values({
    id,
    sessionId: data.sessionId,
    userId: data.userId,
    agentType: data.agentType,
    taskType: data.taskType,
    title: data.title,
    description: data.description,
    status: "queued",
    priority: data.priority || "medium",
    ordering: data.ordering || 0,
    input: data.input,
    thinkingSteps: [],
    dependsOn: [],
  } as InsertAgentTask);

  return id;
}

async function saveMessage(data: {
  sessionId: string;
  userId: number;
  role: InsertAgentMessage["role"];
  content: unknown;
  agentType?: string;
  ordering: number;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(agentMessages).values({
    id: nanoid(),
    sessionId: data.sessionId,
    userId: data.userId,
    role: data.role,
    content: data.content,
    agentType: data.agentType,
    isStreaming: false,
    ordering: data.ordering,
  });
}

async function updateSessionStatus(
  sessionId: string,
  status: InsertAgentSession["status"],
  extra?: Partial<InsertAgentSession>
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(agentSessions)
    .set({ status, ...extra, updatedAt: new Date() })
    .where(eq(agentSessions.id, sessionId));
}

async function updateTaskStatus(
  taskId: string,
  status: InsertAgentTask["status"],
  extra?: Partial<InsertAgentTask>
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(agentTasks)
    .set({ status, ...extra })
    .where(eq(agentTasks.id, taskId));
}

// ─── Express Router ───────────────────────────────────────────────────────────
const router = Router();

/**
 * POST /api/agent/stream
 * Main streaming endpoint for the agentic system.
 * Accepts a user goal and streams the multi-agent execution.
 */
router.post("/stream", async (req: Request, res: Response) => {
  const { goal, sessionId: existingSessionId, agentType = "orchestrator", userId } = req.body;

  if (!goal || !userId) {
    res.status(400).json({ error: "goal and userId are required" });
    return;
  }

  let sessionId = existingSessionId;

  try {
    // Create or reuse session
    if (!sessionId) {
      sessionId = await createSession({ userId, goal });
    }

    // Load memory context for personalization
    const memoryContext = await buildMemoryContext(userId, sessionId);

    // Load previous messages for this session
    const db = await getDb();
    let previousMessages: unknown[] = [];
    if (db) {
      const msgs = await db
        .select()
        .from(agentMessages)
        .where(eq(agentMessages.sessionId, sessionId))
        .orderBy(agentMessages.ordering);
      previousMessages = msgs.map((m) => m.content);
    }

    // Save user message
    await saveMessage({
      sessionId,
      userId,
      role: "user",
      content: { id: generateId(), role: "user", parts: [{ type: "text", text: goal }] },
      ordering: previousMessages.length,
    });

    // Get agent-specific tools
    const tools = agentToolSets[agentType as keyof typeof agentToolSets] || agentToolSets.orchestrator;

    // Build system prompt with memory context
    const systemPrompt = `${AGENT_PROMPTS[agentType] || AGENT_PROMPTS.orchestrator}

${memoryContext ? `\n## Persistent Memory Context\n${memoryContext}` : ""}

## Current Session
Session ID: ${sessionId}
Goal: ${goal}

Always think step-by-step. Show your reasoning process. After completing tasks, provide a clear summary of what was accomplished and what the user should do next.`;

    // Build model messages from history
    const historyMessages = previousMessages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.parts?.map((p: any) => p.text || "").join("") || "",
      }));

    // Update session to executing
    await updateSessionStatus(sessionId, "executing", { currentPhase: "execute" });

    // Stream the agent response
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const messageId = generateId();
        writer.write({ type: "start", messageId });

        const result = streamText({
          model: getModel(),
          system: systemPrompt,
          messages: [
            ...historyMessages,
            { role: "user", content: goal },
          ],
          tools,
          stopWhen: stepCountIs(8),
          onStepFinish: async ({ toolResults }) => {
            // Store tool results in memory
            if (toolResults && toolResults.length > 0) {
              for (const toolResult of toolResults) {
                await writeMemory({
                  userId,
                  sessionId,
                  memoryType: "episodic",
                  key: `tool_result_${toolResult.toolName}_${Date.now()}`,
                  value: JSON.stringify(toolResult.output).slice(0, 2000),
                  importance: 0.7,
                });
              }
            }
          },
        });

        result.consumeStream();
        writer.merge(result.toUIMessageStream({ sendStart: false }));
      },
      onFinish: async ({ messages }) => {
        const finalMessage = messages[messages.length - 1];
        if (finalMessage?.role === "assistant") {
          await saveMessage({
            sessionId,
            userId,
            role: "assistant",
            content: finalMessage,
            agentType,
            ordering: previousMessages.length + 1,
          });

          // Store the response summary in episodic memory
          const textContent = finalMessage.parts
            ?.filter((p: any) => p.type === "text")
            .map((p: any) => p.text)
            .join("")
            .slice(0, 1000);

          if (textContent) {
            await writeMemory({
              userId,
              sessionId,
              memoryType: "episodic",
              key: `agent_response_${agentType}_${Date.now()}`,
              value: textContent,
              importance: 0.6,
            });
          }
        }

        await updateSessionStatus(sessionId, "completed", {
          currentPhase: "reflect",
          completedAt: new Date(),
        });
      },
    });

    pipeUIMessageStreamToResponse({ response: res, stream });
  } catch (error) {
    console.error("[AgentOrchestrator] Error:", error);
    if (sessionId) {
      await updateSessionStatus(sessionId, "failed");
    }
    if (!res.headersSent) {
      res.status(500).json({ error: "Agent execution failed" });
    }
  }
});

/**
 * POST /api/agent/plan
 * Generate a structured plan for a goal without executing it.
 */
router.post("/plan", async (req: Request, res: Response) => {
  const { goal, currentRole, targetRole, userId } = req.body;

  if (!goal || !userId) {
    res.status(400).json({ error: "goal and userId are required" });
    return;
  }

  try {
    const sessionId = await createSession({ userId, goal });
    const memoryContext = await buildMemoryContext(userId);

    const result = streamText({
      model: getModel(),
      system: `${AGENT_PROMPTS.orchestrator}

${memoryContext ? `\n## User Memory\n${memoryContext}` : ""}

Generate a detailed execution plan. Format your response as a clear plan with:
1. **Objective** - What we're achieving
2. **Phase 1: Career Analysis** (Career Strategist Agent)
3. **Phase 2: Skill Assessment** (Skill Analyst Agent)  
4. **Phase 3: Resume Optimization** (Resume Expert Agent)
5. **Phase 4: Job Matching** (Job Matcher Agent)
6. **Phase 5: Interview Preparation** (Interview Coach Agent)
7. **Timeline & Success Metrics**

Be specific, actionable, and personalized.`,
      messages: [
        {
          role: "user",
          content: `Create an execution plan for: "${goal}". ${currentRole ? `Current role: ${currentRole}.` : ""} ${targetRole ? `Target: ${targetRole}.` : ""}`,
        },
      ],
    });

    // Return sessionId in header for client to track
    res.setHeader("X-Session-Id", sessionId);
    result.pipeTextStreamToResponse(res);
  } catch (error) {
    console.error("[AgentOrchestrator] Plan error:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

export default router;
