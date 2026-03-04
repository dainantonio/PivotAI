import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  boolean,
  float,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Career Profiles ──────────────────────────────────────────────────────────
export const careerProfiles = mysqlTable("career_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  currentRole: varchar("currentRole", { length: 255 }),
  industry: varchar("industry", { length: 255 }),
  targetRole: varchar("targetRole", { length: 255 }),
  yearsExperience: int("yearsExperience"),
  skills: json("skills").$type<string[]>(),
  goals: json("goals").$type<string[]>(),
  displacementRisk: float("displacementRisk"),
  matchPercentage: float("matchPercentage"),
  careerData: json("careerData").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CareerProfile = typeof careerProfiles.$inferSelect;
export type InsertCareerProfile = typeof careerProfiles.$inferInsert;

// ─── Agent Sessions ───────────────────────────────────────────────────────────
export const agentSessions = mysqlTable("agent_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }),
  goal: text("goal").notNull(),
  status: mysqlEnum("status", ["pending", "planning", "executing", "reflecting", "completed", "failed", "paused"])
    .default("pending")
    .notNull(),
  currentPhase: mysqlEnum("currentPhase", ["plan", "execute", "reflect"]).default("plan"),
  plan: json("plan").$type<AgentPlan>(),
  reflection: text("reflection"),
  agentsInvolved: json("agentsInvolved").$type<string[]>(),
  totalTasks: int("totalTasks").default(0),
  completedTasks: int("completedTasks").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type AgentSession = typeof agentSessions.$inferSelect;
export type InsertAgentSession = typeof agentSessions.$inferInsert;

// ─── Agent Tasks ──────────────────────────────────────────────────────────────
export const agentTasks = mysqlTable("agent_tasks", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 36 }).notNull(),
  userId: int("userId").notNull(),
  agentType: mysqlEnum("agentType", [
    "orchestrator",
    "career_strategist",
    "resume_expert",
    "interview_coach",
    "skill_analyst",
    "job_matcher",
  ]).notNull(),
  taskType: varchar("taskType", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["queued", "running", "completed", "failed", "cancelled", "skipped"])
    .default("queued")
    .notNull(),
  priority: mysqlEnum("priority", ["critical", "high", "medium", "low"]).default("medium").notNull(),
  ordering: int("ordering").default(0).notNull(),
  input: json("input").$type<Record<string, unknown>>(),
  output: json("output").$type<Record<string, unknown>>(),
  errorMessage: text("errorMessage"),
  thinkingSteps: json("thinkingSteps").$type<ThinkingStep[]>(),
  durationMs: int("durationMs"),
  dependsOn: json("dependsOn").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
});

export type AgentTask = typeof agentTasks.$inferSelect;
export type InsertAgentTask = typeof agentTasks.$inferInsert;

// ─── Agent Messages (Chat History) ───────────────────────────────────────────
export const agentMessages = mysqlTable("agent_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 36 }).notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system", "tool"]).notNull(),
  content: json("content").notNull(),
  agentType: varchar("agentType", { length: 64 }),
  isStreaming: boolean("isStreaming").default(false),
  ordering: int("ordering").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentMessage = typeof agentMessages.$inferSelect;
export type InsertAgentMessage = typeof agentMessages.$inferInsert;

// ─── Agent Memory ─────────────────────────────────────────────────────────────
export const agentMemory = mysqlTable("agent_memory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 36 }),
  memoryType: mysqlEnum("memoryType", ["episodic", "semantic", "procedural", "working"]).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  importance: float("importance").default(0.5),
  accessCount: int("accessCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastAccessedAt: timestamp("lastAccessedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type AgentMemoryEntry = typeof agentMemory.$inferSelect;
export type InsertAgentMemoryEntry = typeof agentMemory.$inferInsert;

// ─── Resume Versions ──────────────────────────────────────────────────────────
export const resumeVersions = mysqlTable("resume_versions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 36 }),
  version: int("version").default(1).notNull(),
  originalText: text("originalText"),
  targetRole: varchar("targetRole", { length: 255 }),
  atsScore: int("atsScore"),
  injectedKeywords: json("injectedKeywords").$type<string[]>(),
  removedWeakPhrases: json("removedWeakPhrases").$type<string[]>(),
  optimizedBullets: json("optimizedBullets").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ResumeVersion = typeof resumeVersions.$inferSelect;
export type InsertResumeVersion = typeof resumeVersions.$inferInsert;

// ─── Job Matches ──────────────────────────────────────────────────────────────
export const jobMatches = mysqlTable("job_matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 36 }),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  location: varchar("location", { length: 255 }),
  matchScore: float("matchScore"),
  salary: varchar("salary", { length: 100 }),
  skills: json("skills").$type<string[]>(),
  description: text("description"),
  applyUrl: varchar("applyUrl", { length: 1000 }),
  isSaved: boolean("isSaved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JobMatch = typeof jobMatches.$inferSelect;
export type InsertJobMatch = typeof jobMatches.$inferInsert;

// ─── Shared Types ─────────────────────────────────────────────────────────────
export interface AgentPlan {
  objective: string;
  phases: PlanPhase[];
  estimatedDuration: string;
  agentsRequired: string[];
}

export interface PlanPhase {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  agentType: string;
  status: "pending" | "active" | "completed" | "failed";
}

export interface ThinkingStep {
  id: string;
  timestamp: number;
  agentType: string;
  thought: string;
  action?: string;
  observation?: string;
}
