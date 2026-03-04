import { z } from "zod/v4";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getCareerProfile,
  upsertCareerProfile,
  getAgentSessions,
  getAgentSession,
  getAgentTasks,
  getAllUserTasks,
  getSessionMessages,
  getResumeVersions,
  saveResumeVersion,
  getJobMatches,
  saveJobMatches,
  getUserMemory,
} from "./db";
import { buildMemoryContext, writeMemory, storeCareerMemory } from "./agentMemory";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,

  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Career Profile ────────────────────────────────────────────────────────
  career: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return getCareerProfile(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          currentRole: z.string().optional(),
          industry: z.string().optional(),
          targetRole: z.string().optional(),
          yearsExperience: z.number().optional(),
          skills: z.array(z.string()).optional(),
          goals: z.array(z.string()).optional(),
          displacementRisk: z.number().optional(),
          matchPercentage: z.number().optional(),
          careerData: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertCareerProfile({
          userId: ctx.user.id,
          ...input,
        });

        // Store in agent memory for personalization
        await storeCareerMemory(ctx.user.id, {
          currentRole: input.currentRole,
          industry: input.industry,
          targetRole: input.targetRole,
          skills: input.skills,
          goals: input.goals,
          displacementRisk: input.displacementRisk,
        });

        return { success: true };
      }),
  }),

  // ─── Agent Sessions ────────────────────────────────────────────────────────
  agent: router({
    listSessions: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return getAgentSessions(ctx.user.id, input.limit ?? 20);
      }),

    getSession: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ ctx, input }) => {
        return getAgentSession(input.sessionId, ctx.user.id);
      }),

    getSessionMessages: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ ctx, input }) => {
        const session = await getAgentSession(input.sessionId, ctx.user.id);
        if (!session) throw new Error("Session not found");
        return getSessionMessages(input.sessionId);
      }),

    getTaskQueue: protectedProcedure
      .input(
        z.object({
          sessionId: z.string().optional(),
          limit: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (input.sessionId) {
          return getAgentTasks(input.sessionId);
        }
        return getAllUserTasks(ctx.user.id, input.limit ?? 50);
      }),

    getMemory: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return getUserMemory(ctx.user.id, input.limit ?? 30);
      }),

    getMemoryContext: protectedProcedure.query(async ({ ctx }) => {
      return buildMemoryContext(ctx.user.id);
    }),
  }),

  // ─── Resume ────────────────────────────────────────────────────────────────
  resume: router({
    getVersions: protectedProcedure.query(async ({ ctx }) => {
      return getResumeVersions(ctx.user.id);
    }),

    saveVersion: protectedProcedure
      .input(
        z.object({
          sessionId: z.string().optional(),
          originalText: z.string().optional(),
          targetRole: z.string().optional(),
          atsScore: z.number().optional(),
          injectedKeywords: z.array(z.string()).optional(),
          removedWeakPhrases: z.array(z.string()).optional(),
          optimizedBullets: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existing = await getResumeVersions(ctx.user.id);
        await saveResumeVersion({
          userId: ctx.user.id,
          version: (existing.length || 0) + 1,
          ...input,
        });
        return { success: true };
      }),
  }),

  // ─── Jobs ──────────────────────────────────────────────────────────────────
  jobs: router({
    getMatches: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return getJobMatches(ctx.user.id, input.limit ?? 20);
      }),

    saveMatches: protectedProcedure
      .input(
        z.object({
          sessionId: z.string().optional(),
          matches: z.array(
            z.object({
              title: z.string(),
              company: z.string().optional(),
              location: z.string().optional(),
              matchScore: z.number().optional(),
              salary: z.string().optional(),
              skills: z.array(z.string()).optional(),
              description: z.string().optional(),
              applyUrl: z.string().optional(),
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await saveJobMatches(
          input.matches.map((m) => ({
            userId: ctx.user.id,
            sessionId: input.sessionId,
            ...m,
          }))
        );
        return { success: true };
      }),
  }),

  // ─── Memory ────────────────────────────────────────────────────────────────
  memory: router({
    write: protectedProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          memoryType: z.enum(["episodic", "semantic", "procedural", "working"]),
          sessionId: z.string().optional(),
          importance: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await writeMemory({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    getContext: protectedProcedure
      .input(z.object({ sessionId: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        return buildMemoryContext(ctx.user.id, input.sessionId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
