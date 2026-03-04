/**
 * Agent Tools
 * Defines all tools available to the multi-agent system.
 * Each tool corresponds to a specialized capability used by one or more agents.
 */

import { tool } from "ai";
import { z } from "zod/v4";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createPatchedFetch } from "./_core/patchedFetch";

function getModel() {
  const openai = createOpenAI({
    apiKey: process.env.BUILT_IN_FORGE_API_KEY,
    baseURL: `${process.env.BUILT_IN_FORGE_API_URL}/v1`,
    fetch: createPatchedFetch(globalThis.fetch),
  });
  return openai.chat("gemini-2.5-flash");
}

// ─── Career Analysis Tool ─────────────────────────────────────────────────────
export const analyzeCareerRisk = tool({
  description:
    "Analyze AI displacement risk for a given role and industry. Returns risk score, transferable skills, and recommended pivot roles.",
  inputSchema: z.object({
    currentRole: z.string().describe("The user's current job title"),
    industry: z.string().describe("The user's current industry"),
  }),
  execute: async ({ currentRole, industry }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are an AI Career Strategist with deep knowledge of labor market trends and AI automation impacts.
Return a JSON object with: displacementRisk (0-100), transferableSkills (array of 4 strings), recommendedPivot (string), matchPercentage (0-100), topIndustries (array of 3 strings), rationale (string explaining the risk).`,
      messages: [
        {
          role: "user",
          content: `Analyze career risk for: Role="${currentRole}", Industry="${industry}"`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse response", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Skill Gap Analysis Tool ──────────────────────────────────────────────────
export const analyzeSkillGap = tool({
  description:
    "Perform a detailed skill gap analysis comparing current skills to target role requirements. Returns gap scores and learning priorities.",
  inputSchema: z.object({
    currentRole: z.string(),
    targetRole: z.string(),
    existingSkills: z.array(z.string()).optional().describe("Skills the user already has"),
  }),
  execute: async ({ currentRole, targetRole, existingSkills }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are a Skills Assessment Expert. Return a JSON object with: skillGaps (array of {skill, currentLevel 0-100, targetLevel 0-100, priority: High/Medium/Low, description, learningResources: string[]}), overallReadiness (0-100), estimatedTimeToReady (string), topPrioritySkills (array of 3 strings).`,
      messages: [
        {
          role: "user",
          content: `Analyze skill gap from "${currentRole}" to "${targetRole}". Existing skills: ${existingSkills?.join(", ") || "none specified"}.`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Resume Optimization Tool ─────────────────────────────────────────────────
export const optimizeResume = tool({
  description:
    "Optimize a resume for a target role. Rewrites bullets with strong action verbs, injects ATS keywords, and removes weak phrases.",
  inputSchema: z.object({
    resumeText: z.string().describe("The user's current resume or experience text"),
    targetRole: z.string().describe("The role the user is targeting"),
    keySkillsToHighlight: z.array(z.string()).optional(),
  }),
  execute: async ({ resumeText, targetRole, keySkillsToHighlight }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are an Expert Technical Recruiter and Resume Writer. Return a JSON object with: atsScore (0-100), injectedKeywords (string[]), removedWeakPhrases (string[]), optimizedBullets (string[]), executiveSummary (string), keyAchievements (string[]).`,
      messages: [
        {
          role: "user",
          content: `Optimize this resume for "${targetRole}". ${keySkillsToHighlight ? `Highlight: ${keySkillsToHighlight.join(", ")}.` : ""}\n\nResume:\n${resumeText}`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Learning Roadmap Tool ────────────────────────────────────────────────────
export const generateLearningRoadmap = tool({
  description:
    "Generate a personalized learning roadmap with modules, resources, and timeline to bridge skill gaps for a target role.",
  inputSchema: z.object({
    targetRole: z.string(),
    skillGaps: z.array(z.string()).describe("List of skills to develop"),
    timeAvailablePerWeek: z.number().optional().describe("Hours per week available for learning"),
    learningStyle: z.enum(["visual", "hands-on", "reading", "mixed"]).optional(),
  }),
  execute: async ({ targetRole, skillGaps, timeAvailablePerWeek, learningStyle }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are a Learning Experience Designer and Career Coach. Return a JSON object with: totalDurationWeeks (number), modules (array of {id, title, description, skills: string[], resources: {title, type, url, duration}[], weekNumber, difficulty: beginner/intermediate/advanced}), milestones (array of {week, achievement}), weeklySchedule (string).`,
      messages: [
        {
          role: "user",
          content: `Create a learning roadmap for "${targetRole}". Skills to develop: ${skillGaps.join(", ")}. ${timeAvailablePerWeek ? `Available: ${timeAvailablePerWeek}h/week.` : ""} ${learningStyle ? `Learning style: ${learningStyle}.` : ""}`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Job Matching Tool ────────────────────────────────────────────────────────
export const findJobMatches = tool({
  description:
    "Find and score job matches based on user's profile, target role, and skills. Returns ranked job opportunities.",
  inputSchema: z.object({
    targetRole: z.string(),
    skills: z.array(z.string()),
    location: z.string().optional(),
    experienceLevel: z.enum(["entry", "mid", "senior", "lead"]).optional(),
    salaryExpectation: z.string().optional(),
  }),
  execute: async ({ targetRole, skills, location, experienceLevel, salaryExpectation }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are a Job Market Intelligence Agent. Generate realistic job matches. Return a JSON object with: jobs (array of {id, title, company, location, matchScore 0-100, salary, requiredSkills: string[], niceToHaveSkills: string[], description, whyGoodFit, applyUrl: "#", postedDate}), marketInsights (string), averageSalary (string), demandLevel: high/medium/low.`,
      messages: [
        {
          role: "user",
          content: `Find job matches for "${targetRole}". Skills: ${skills.join(", ")}. ${location ? `Location: ${location}.` : ""} ${experienceLevel ? `Level: ${experienceLevel}.` : ""} ${salaryExpectation ? `Salary: ${salaryExpectation}.` : ""}`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Interview Preparation Tool ───────────────────────────────────────────────
export const prepareInterviewStrategy = tool({
  description:
    "Create a personalized interview preparation strategy with common questions, STAR stories, and coaching tips for a target role.",
  inputSchema: z.object({
    targetRole: z.string(),
    keyExperiences: z.string().describe("Brief description of relevant experiences"),
    interviewType: z.enum(["technical", "behavioral", "case", "mixed"]).optional(),
  }),
  execute: async ({ targetRole, keyExperiences, interviewType }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are Coach Atlas, an expert interview coach. Return a JSON object with: topQuestions (array of {question, category, difficulty, sampleAnswer, tips}), starStories (array of {situation, task, action, result, applicableTo: string[]}), technicalTopics (string[]), commonMistakes (string[]), preparationPlan (string).`,
      messages: [
        {
          role: "user",
          content: `Prepare interview strategy for "${targetRole}". ${interviewType ? `Type: ${interviewType}.` : ""} Key experiences: ${keyExperiences}`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Goal Decomposition Tool ──────────────────────────────────────────────────
export const decomposeCareerGoal = tool({
  description:
    "Decompose a high-level career goal into a structured plan with phases, tasks, agent assignments, and timelines.",
  inputSchema: z.object({
    goal: z.string().describe("The user's career goal in natural language"),
    currentRole: z.string().optional(),
    targetRole: z.string().optional(),
    timeframe: z.string().optional().describe("e.g., '6 months', '1 year'"),
  }),
  execute: async ({ goal, currentRole, targetRole, timeframe }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are a Master Career Orchestrator. Decompose the goal into an actionable plan. Return a JSON object with: objective (string), phases (array of {id, title, description, agentType: one of [career_strategist, resume_expert, interview_coach, skill_analyst, job_matcher], tasks: string[], estimatedDays: number, priority: critical/high/medium/low}), estimatedDuration (string), agentsRequired (string[]), successMetrics (string[]), immediateNextStep (string).`,
      messages: [
        {
          role: "user",
          content: `Decompose this career goal: "${goal}". ${currentRole ? `Current role: ${currentRole}.` : ""} ${targetRole ? `Target: ${targetRole}.` : ""} ${timeframe ? `Timeframe: ${timeframe}.` : ""}`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── Reflection Tool ──────────────────────────────────────────────────────────
export const reflectOnProgress = tool({
  description:
    "Reflect on completed agent tasks, evaluate quality of results, and recommend next steps or adjustments.",
  inputSchema: z.object({
    goal: z.string(),
    completedTasks: z.array(
      z.object({
        title: z.string(),
        agentType: z.string(),
        outcome: z.string(),
      })
    ),
    remainingTasks: z.array(z.string()).optional(),
  }),
  execute: async ({ goal, completedTasks, remainingTasks }) => {
    const model = getModel();
    const { text } = await generateText({
      model,
      system: `You are a Reflective AI Supervisor. Evaluate progress and provide strategic guidance. Return a JSON object with: overallProgress (0-100), qualityScore (0-100), keyInsights (string[]), adjustments (string[]), nextPriorityAction (string), motivationalMessage (string), estimatedCompletion (string).`,
      messages: [
        {
          role: "user",
          content: `Reflect on progress toward goal: "${goal}". Completed: ${JSON.stringify(completedTasks)}. Remaining: ${remainingTasks?.join(", ") || "none"}.`,
        },
      ],
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse", raw: text };
    } catch {
      return { error: "Parse error", raw: text };
    }
  },
});

// ─── All Tools Export ─────────────────────────────────────────────────────────
export const allAgentTools = {
  analyzeCareerRisk,
  analyzeSkillGap,
  optimizeResume,
  generateLearningRoadmap,
  findJobMatches,
  prepareInterviewStrategy,
  decomposeCareerGoal,
  reflectOnProgress,
};

// Tools per agent type
export const agentToolSets = {
  orchestrator: {
    decomposeCareerGoal,
    reflectOnProgress,
  },
  career_strategist: {
    analyzeCareerRisk,
    decomposeCareerGoal,
    reflectOnProgress,
  },
  resume_expert: {
    optimizeResume,
    analyzeSkillGap,
  },
  interview_coach: {
    prepareInterviewStrategy,
    analyzeSkillGap,
  },
  skill_analyst: {
    analyzeSkillGap,
    generateLearningRoadmap,
  },
  job_matcher: {
    findJobMatches,
    analyzeCareerRisk,
  },
};
