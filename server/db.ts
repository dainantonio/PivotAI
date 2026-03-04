import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  agentSessions,
  agentTasks,
  agentMessages,
  agentMemory,
  careerProfiles,
  resumeVersions,
  jobMatches,
  InsertCareerProfile,
  InsertResumeVersion,
  InsertJobMatch,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Career Profiles ──────────────────────────────────────────────────────────
export async function getCareerProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(careerProfiles)
    .where(eq(careerProfiles.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertCareerProfile(data: InsertCareerProfile) {
  const db = await getDb();
  if (!db) return;
  await db.insert(careerProfiles).values(data).onDuplicateKeyUpdate({
    set: {
      currentRole: data.currentRole,
      industry: data.industry,
      targetRole: data.targetRole,
      yearsExperience: data.yearsExperience,
      skills: data.skills,
      goals: data.goals,
      displacementRisk: data.displacementRisk,
      matchPercentage: data.matchPercentage,
      careerData: data.careerData,
      updatedAt: new Date(),
    },
  });
}

// ─── Agent Sessions ───────────────────────────────────────────────────────────
export async function getAgentSessions(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(agentSessions)
    .where(eq(agentSessions.userId, userId))
    .orderBy(desc(agentSessions.createdAt))
    .limit(limit);
}

export async function getAgentSession(sessionId: string, userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(agentSessions)
    .where(and(eq(agentSessions.id, sessionId), eq(agentSessions.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

// ─── Agent Tasks ──────────────────────────────────────────────────────────────
export async function getAgentTasks(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(agentTasks)
    .where(eq(agentTasks.sessionId, sessionId))
    .orderBy(agentTasks.ordering);
}

export async function getAllUserTasks(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(agentTasks)
    .where(eq(agentTasks.userId, userId))
    .orderBy(desc(agentTasks.createdAt))
    .limit(limit);
}

// ─── Agent Messages ───────────────────────────────────────────────────────────
export async function getSessionMessages(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(agentMessages)
    .where(eq(agentMessages.sessionId, sessionId))
    .orderBy(agentMessages.ordering);
}

// ─── Resume Versions ──────────────────────────────────────────────────────────
export async function getResumeVersions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(resumeVersions)
    .where(eq(resumeVersions.userId, userId))
    .orderBy(desc(resumeVersions.createdAt))
    .limit(10);
}

export async function saveResumeVersion(data: InsertResumeVersion) {
  const db = await getDb();
  if (!db) return;
  await db.insert(resumeVersions).values(data);
}

// ─── Job Matches ──────────────────────────────────────────────────────────────
export async function getJobMatches(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(jobMatches)
    .where(eq(jobMatches.userId, userId))
    .orderBy(desc(jobMatches.createdAt))
    .limit(limit);
}

export async function saveJobMatches(matches: InsertJobMatch[]) {
  const db = await getDb();
  if (!db) return;
  if (matches.length > 0) {
    await db.insert(jobMatches).values(matches);
  }
}

// ─── Agent Memory ─────────────────────────────────────────────────────────────
export async function getUserMemory(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(agentMemory)
    .where(eq(agentMemory.userId, userId))
    .orderBy(desc(agentMemory.importance), desc(agentMemory.lastAccessedAt))
    .limit(limit);
}
