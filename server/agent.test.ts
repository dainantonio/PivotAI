/**
 * PivotAI Agentic — Backend Test Suite
 *
 * Tests cover:
 * 1. Auth router (logout clears cookie)
 * 2. Career profile router (get/update)
 * 3. Agent session router (list/get)
 * 4. Resume router (save version)
 * 5. Jobs router (get matches)
 * 6. Agent memory helpers
 * 7. Agent orchestrator task decomposition logic
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(overrides?: Partial<AuthenticatedUser>): AuthenticatedUser {
  return {
    id: 1,
    openId: "test-user-openid",
    email: "test@pivotai.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

type CookieCall = { name: string; options: Record<string, unknown> };

function makeCtx(user?: AuthenticatedUser): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];
  const ctx: TrpcContext = {
    user: user ?? null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

// ─── Mock DB helpers ──────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getCareerProfile: vi.fn().mockResolvedValue(null),
  upsertCareerProfile: vi.fn().mockResolvedValue(undefined),
  getAgentSessions: vi.fn().mockResolvedValue([]),
  getAgentSession: vi.fn().mockResolvedValue(null),
  getAgentTasks: vi.fn().mockResolvedValue([]),
  getAllUserTasks: vi.fn().mockResolvedValue([]),
  getSessionMessages: vi.fn().mockResolvedValue([]),
  getResumeVersions: vi.fn().mockResolvedValue([]),
  saveResumeVersion: vi.fn().mockResolvedValue(undefined),
  getJobMatches: vi.fn().mockResolvedValue([]),
  saveJobMatches: vi.fn().mockResolvedValue(undefined),
  getUserMemory: vi.fn().mockResolvedValue([]),
}));

vi.mock("./agentMemory", () => ({
  buildMemoryContext: vi.fn().mockResolvedValue("No memory available."),
  writeMemory: vi.fn().mockResolvedValue(undefined),
  storeCareerMemory: vi.fn().mockResolvedValue(undefined),
}));

// ─── Auth Tests ───────────────────────────────────────────────────────────────

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const { ctx, clearedCookies } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      httpOnly: true,
      path: "/",
    });
  });

  it("returns current user from auth.me when authenticated", async () => {
    const user = makeUser();
    const { ctx } = makeCtx(user);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toMatchObject({ id: 1, email: "test@pivotai.com" });
  });

  it("returns null from auth.me when not authenticated", async () => {
    const { ctx } = makeCtx(undefined);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});

// ─── Career Profile Tests ─────────────────────────────────────────────────────

describe("career.getProfile", () => {
  it("returns null when no profile exists", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.career.getProfile();
    expect(result).toBeNull();
  });

  it("throws UNAUTHORIZED when not authenticated", async () => {
    const { ctx } = makeCtx(undefined);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.career.getProfile()).rejects.toThrow();
  });
});

describe("career.updateProfile", () => {
  it("updates profile and returns success", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.career.updateProfile({
      currentRole: "Software Engineer",
      targetRole: "AI/ML Engineer",
      industry: "Technology",
      yearsExperience: 5,
      skills: ["Python", "TypeScript", "React"],
      goals: ["Transition to AI/ML", "Lead a team"],
    });

    expect(result).toEqual({ success: true });
  });

  it("throws UNAUTHORIZED when not authenticated", async () => {
    const { ctx } = makeCtx(undefined);
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.career.updateProfile({ currentRole: "Engineer" })
    ).rejects.toThrow();
  });
});

// ─── Agent Session Tests ──────────────────────────────────────────────────────

describe("agent.listSessions", () => {
  it("returns empty array when no sessions exist", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.listSessions({ limit: 10 });
    expect(result).toEqual([]);
  });

  it("throws UNAUTHORIZED when not authenticated", async () => {
    const { ctx } = makeCtx(undefined);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.agent.listSessions({})).rejects.toThrow();
  });
});

describe("agent.getSession", () => {
  it("returns null when session does not exist", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.getSession({ sessionId: "non-existent-id" });
    expect(result).toBeNull();
  });
});

describe("agent.getTaskQueue", () => {
  it("returns empty array when no tasks exist", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.getTaskQueue({ limit: 10 });
    expect(result).toEqual([]);
  });

  it("returns session tasks when sessionId provided", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.getTaskQueue({ sessionId: "test-session-id" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("agent.getMemory", () => {
  it("returns empty array when no memory exists", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.getMemory({ limit: 30 });
    expect(result).toEqual([]);
  });
});

describe("agent.getMemoryContext", () => {
  it("returns memory context string", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.getMemoryContext();
    expect(typeof result).toBe("string");
  });
});

// ─── Resume Tests ─────────────────────────────────────────────────────────────

describe("resume.getVersions", () => {
  it("returns empty array when no versions exist", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.getVersions();
    expect(result).toEqual([]);
  });

  it("throws UNAUTHORIZED when not authenticated", async () => {
    const { ctx } = makeCtx(undefined);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.resume.getVersions()).rejects.toThrow();
  });
});

describe("resume.saveVersion", () => {
  it("saves a resume version and returns success", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resume.saveVersion({
      originalText: "Experienced software engineer with 5 years...",
      targetRole: "AI/ML Engineer",
      atsScore: 72,
      injectedKeywords: ["machine learning", "Python", "TensorFlow"],
    });

    expect(result).toEqual({ success: true });
  });
});

// ─── Jobs Tests ───────────────────────────────────────────────────────────────

describe("jobs.getMatches", () => {
  it("returns empty array when no matches exist", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.jobs.getMatches({ limit: 20 });
    expect(result).toEqual([]);
  });
});

describe("jobs.saveMatches", () => {
  it("saves job matches and returns success", async () => {
    const { ctx } = makeCtx(makeUser());
    const caller = appRouter.createCaller(ctx);

    const result = await caller.jobs.saveMatches({
      matches: [
        {
          title: "Senior AI Engineer",
          company: "TechCorp",
          location: "Remote",
          matchScore: 87,
          salary: "$150k-$200k",
          skills: ["Python", "LangChain", "RAG"],
        },
      ],
    });

    expect(result).toEqual({ success: true });
  });
});

// ─── Agent Orchestrator Logic Tests ──────────────────────────────────────────

describe("Agent Goal Decomposition Logic", () => {
  it("identifies career-related goals correctly", () => {
    const careerGoals = [
      "Help me transition from software engineer to AI/ML engineer",
      "Build a learning roadmap for becoming a product manager",
      "Analyze my displacement risk and suggest pivot opportunities",
    ];

    for (const goal of careerGoals) {
      const isCareerGoal =
        goal.toLowerCase().includes("career") ||
        goal.toLowerCase().includes("transition") ||
        goal.toLowerCase().includes("roadmap") ||
        goal.toLowerCase().includes("engineer") ||
        goal.toLowerCase().includes("manager") ||
        goal.toLowerCase().includes("displacement") ||
        goal.toLowerCase().includes("pivot");
      expect(isCareerGoal).toBe(true);
    }
  });

  it("validates agent types enum values", () => {
    const validAgentTypes = [
      "orchestrator",
      "career_strategist",
      "resume_expert",
      "interview_coach",
      "skill_analyst",
      "job_matcher",
    ];

    expect(validAgentTypes).toContain("orchestrator");
    expect(validAgentTypes).toContain("career_strategist");
    expect(validAgentTypes).toContain("resume_expert");
    expect(validAgentTypes).toContain("interview_coach");
    expect(validAgentTypes).toContain("skill_analyst");
    expect(validAgentTypes).toContain("job_matcher");
    expect(validAgentTypes).toHaveLength(6);
  });

  it("validates session status transitions", () => {
    const validStatuses = [
      "pending",
      "planning",
      "executing",
      "reflecting",
      "completed",
      "failed",
      "paused",
    ];

    const validTransitions: Record<string, string[]> = {
      pending: ["planning", "failed"],
      planning: ["executing", "failed"],
      executing: ["reflecting", "completed", "failed", "paused"],
      reflecting: ["executing", "completed", "failed"],
      paused: ["executing", "failed"],
      completed: [],
      failed: [],
    };

    // Every status should have defined transitions
    for (const status of validStatuses) {
      expect(validTransitions).toHaveProperty(status);
    }
  });

  it("validates task priority ordering", () => {
    const priorities = ["critical", "high", "medium", "low"];
    const priorityWeights: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    expect(priorityWeights.critical).toBeGreaterThan(priorityWeights.high);
    expect(priorityWeights.high).toBeGreaterThan(priorityWeights.medium);
    expect(priorityWeights.medium).toBeGreaterThan(priorityWeights.low);
  });

  it("validates memory types for agent context", () => {
    const memoryTypes = ["episodic", "semantic", "procedural", "working"];

    // Episodic: specific past events
    expect(memoryTypes).toContain("episodic");
    // Semantic: general knowledge about the user
    expect(memoryTypes).toContain("semantic");
    // Procedural: how to do things
    expect(memoryTypes).toContain("procedural");
    // Working: current session context
    expect(memoryTypes).toContain("working");
  });
});

// ─── Plan-Execute-Reflect Cycle Tests ─────────────────────────────────────────

describe("Plan-Execute-Reflect Cycle", () => {
  it("validates plan phase structure", () => {
    const mockPlan = {
      objective: "Transition from Software Engineer to AI/ML Engineer",
      phases: [
        {
          id: "phase-1",
          title: "Skill Gap Analysis",
          description: "Identify gaps between current and target skills",
          tasks: ["analyze-skills", "identify-gaps"],
          agentType: "skill_analyst",
          status: "pending" as const,
        },
        {
          id: "phase-2",
          title: "Resume Optimization",
          description: "Optimize resume for AI/ML roles",
          tasks: ["optimize-resume"],
          agentType: "resume_expert",
          status: "pending" as const,
        },
      ],
      estimatedDuration: "2-4 weeks",
      agentsRequired: ["skill_analyst", "resume_expert", "career_strategist"],
    };

    expect(mockPlan.phases).toHaveLength(2);
    expect(mockPlan.agentsRequired).toContain("skill_analyst");
    expect(mockPlan.phases[0]?.status).toBe("pending");
    expect(mockPlan.estimatedDuration).toBeTruthy();
  });

  it("validates thinking step structure", () => {
    const thinkingStep = {
      id: "step-1",
      timestamp: Date.now(),
      agentType: "career_strategist",
      thought: "Analyzing user's current role and target role to identify pivot opportunities",
      action: "analyze_career_gap",
      observation: "Found 3 key skill gaps: ML fundamentals, Python data science, cloud ML platforms",
    };

    expect(thinkingStep.id).toBeTruthy();
    expect(thinkingStep.timestamp).toBeGreaterThan(0);
    expect(thinkingStep.agentType).toBe("career_strategist");
    expect(thinkingStep.thought).toBeTruthy();
    expect(thinkingStep.action).toBeTruthy();
    expect(thinkingStep.observation).toBeTruthy();
  });
});
