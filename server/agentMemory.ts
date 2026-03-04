/**
 * Agent Memory Service
 * Provides persistent context storage across sessions using a key-value store
 * with memory types: episodic, semantic, procedural, working
 */

import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "./db";
import { agentMemory, InsertAgentMemoryEntry, AgentMemoryEntry } from "../drizzle/schema";

export type MemoryType = "episodic" | "semantic" | "procedural" | "working";

export interface MemoryWriteOptions {
  userId: number;
  sessionId?: string;
  memoryType: MemoryType;
  key: string;
  value: string;
  metadata?: Record<string, unknown>;
  importance?: number;
  expiresInMs?: number;
}

export interface MemoryReadOptions {
  userId: number;
  sessionId?: string;
  memoryType?: MemoryType;
  key?: string;
  limit?: number;
}

/**
 * Write a memory entry, updating if key already exists for this user
 */
export async function writeMemory(opts: MemoryWriteOptions): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const expiresAt = opts.expiresInMs ? new Date(Date.now() + opts.expiresInMs) : null;

  const entry: InsertAgentMemoryEntry = {
    userId: opts.userId,
    sessionId: opts.sessionId,
    memoryType: opts.memoryType,
    key: opts.key,
    value: opts.value,
    metadata: opts.metadata,
    importance: opts.importance ?? 0.5,
    accessCount: 0,
    lastAccessedAt: new Date(),
    ...(expiresAt ? { expiresAt } : {}),
  };

  // Upsert: update if same user+key+memoryType exists
  await db.insert(agentMemory).values(entry).onDuplicateKeyUpdate({
    set: {
      value: opts.value,
      metadata: opts.metadata ?? null,
      importance: opts.importance ?? 0.5,
      lastAccessedAt: new Date(),
      ...(expiresAt ? { expiresAt } : {}),
    },
  });
}

/**
 * Read memory entries for a user, optionally filtered by type/key/session
 */
export async function readMemory(opts: MemoryReadOptions): Promise<AgentMemoryEntry[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(agentMemory.userId, opts.userId)];

  if (opts.memoryType) {
    conditions.push(eq(agentMemory.memoryType, opts.memoryType));
  }
  if (opts.key) {
    conditions.push(eq(agentMemory.key, opts.key));
  }
  if (opts.sessionId) {
    conditions.push(eq(agentMemory.sessionId, opts.sessionId));
  }

  const results = await db
    .select()
    .from(agentMemory)
    .where(and(...conditions))
    .orderBy(desc(agentMemory.importance), desc(agentMemory.lastAccessedAt))
    .limit(opts.limit ?? 50);

  // Update access count for retrieved entries
  if (results.length > 0) {
    const ids = results.map((r) => r.id);
    await db
      .update(agentMemory)
      .set({
        accessCount: sql`${agentMemory.accessCount} + 1`,
        lastAccessedAt: new Date(),
      })
      .where(eq(agentMemory.userId, opts.userId));
  }

  return results;
}

/**
 * Get a single memory value by key
 */
export async function getMemoryValue(
  userId: number,
  key: string,
  memoryType: MemoryType = "semantic"
): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(agentMemory)
    .where(
      and(
        eq(agentMemory.userId, userId),
        eq(agentMemory.key, key),
        eq(agentMemory.memoryType, memoryType)
      )
    )
    .limit(1);

  return results[0]?.value ?? null;
}

/**
 * Build a context summary string from user's memory for agent prompts
 */
export async function buildMemoryContext(userId: number, sessionId?: string): Promise<string> {
  const db = await getDb();
  if (!db) return "";

  const [semantic, episodic, procedural] = await Promise.all([
    readMemory({ userId, memoryType: "semantic", limit: 10 }),
    readMemory({ userId, sessionId, memoryType: "episodic", limit: 5 }),
    readMemory({ userId, memoryType: "procedural", limit: 5 }),
  ]);

  const parts: string[] = [];

  if (semantic.length > 0) {
    parts.push("## User Profile & Knowledge");
    semantic.forEach((m) => parts.push(`- ${m.key}: ${m.value}`));
  }

  if (episodic.length > 0) {
    parts.push("\n## Recent Session Context");
    episodic.forEach((m) => parts.push(`- ${m.key}: ${m.value}`));
  }

  if (procedural.length > 0) {
    parts.push("\n## Learned Preferences & Procedures");
    procedural.forEach((m) => parts.push(`- ${m.key}: ${m.value}`));
  }

  return parts.join("\n");
}

/**
 * Store career profile data in semantic memory
 */
export async function storeCareerMemory(
  userId: number,
  data: {
    currentRole?: string;
    industry?: string;
    targetRole?: string;
    skills?: string[];
    goals?: string[];
    displacementRisk?: number;
  }
): Promise<void> {
  const entries: MemoryWriteOptions[] = [];

  if (data.currentRole) {
    entries.push({
      userId,
      memoryType: "semantic",
      key: "current_role",
      value: data.currentRole,
      importance: 0.9,
    });
  }
  if (data.industry) {
    entries.push({
      userId,
      memoryType: "semantic",
      key: "industry",
      value: data.industry,
      importance: 0.8,
    });
  }
  if (data.targetRole) {
    entries.push({
      userId,
      memoryType: "semantic",
      key: "target_role",
      value: data.targetRole,
      importance: 0.95,
    });
  }
  if (data.skills?.length) {
    entries.push({
      userId,
      memoryType: "semantic",
      key: "skills",
      value: data.skills.join(", "),
      importance: 0.85,
    });
  }
  if (data.goals?.length) {
    entries.push({
      userId,
      memoryType: "semantic",
      key: "career_goals",
      value: data.goals.join("; "),
      importance: 0.9,
    });
  }
  if (data.displacementRisk !== undefined) {
    entries.push({
      userId,
      memoryType: "semantic",
      key: "displacement_risk",
      value: `${data.displacementRisk}%`,
      importance: 0.7,
    });
  }

  await Promise.all(entries.map(writeMemory));
}
