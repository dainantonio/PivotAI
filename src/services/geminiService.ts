import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface OptimizedResume {
  atsScore: number;
  injectedKeywords: string[];
  removedWeakPhrases: string[];
  optimizedBullets: string[];
}

export interface InterviewResponse {
  feedback: string;
  nextQuestion: string;
}

export interface CareerPath {
  displacementRisk: number;
  transferableSkills: string[];
  recommendedPivot: string;
  matchPercentage: number;
  industry?: string;
  syllabus: {
    moduleTitle: string;
    skillsToLearn: string[];
  }[];
}

/**
 * Optimizes a resume for a target role using Gemini 1.5 Flash.
 */
export async function optimizeResume(legacyText: string, targetRole: string): Promise<OptimizedResume> {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Legacy Resume: ${legacyText}\nTarget Role: ${targetRole}`,
    config: {
      systemInstruction: "You are an Expert Technical Recruiter. Your task is to rewrite the provided legacy resume text to highlight transferable skills for the target role. Use strong action verbs and remove weak phrasing. Ensure the output is professional and optimized for ATS systems.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          atsScore: { type: Type.NUMBER, description: "ATS compatibility score from 1-100" },
          injectedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords added to the resume" },
          removedWeakPhrases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weak phrases removed" },
          optimizedBullets: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The rewritten, high-impact resume bullets" }
        },
        required: ["atsScore", "injectedKeywords", "removedWeakPhrases", "optimizedBullets"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

/**
 * Powers the AI Mock Interviewer "Coach Atlas".
 */
export async function interview(messages: { role: string, content: string }[], currentAnswer: string, targetRole: string): Promise<InterviewResponse> {
  // Sanitize history: map to { role: 'user' | 'model', parts: [{ text }] }
  // Ensure history starts with 'user'
  const history = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // If history is empty or doesn't start with user, we might need to adjust, 
  // but usually the first message is the AI's intro.
  // Gemini startChat history must alternate and start with user if provided.
  // If the first message is 'model', we can prepend a dummy user message or just start fresh.
  
  const chat = ai.chats.create({
    model: "gemini-1.5-flash",
    config: {
      systemInstruction: `You are Coach Atlas, a tough but fair technical interviewer for a ${targetRole}. The user just answered your last question. Provide exactly 1 sentence of constructive feedback, followed by the next technical interview question.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING, description: "One sentence of constructive feedback" },
          nextQuestion: { type: Type.STRING, description: "The next technical interview question" }
        },
        required: ["feedback", "nextQuestion"]
      }
    },
    history: history.length > 0 && history[0].role === 'user' ? history : []
  });

  const response = await chat.sendMessage({ message: currentAnswer });
  return JSON.parse(response.text || '{}');
}

/**
 * Dynamically generates a career pivot path.
 */
export async function generatePath(currentRole: string, industry: string): Promise<CareerPath> {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Current Role: ${currentRole}\nIndustry: ${industry}`,
    config: {
      systemInstruction: "You are an AI Career Strategist. Calculate the user's risk of AI automation, identify 4 transferable skills, and recommend the best tech-adjacent pivot role (e.g., AI Prompt Engineer, AI Auditor). Finally, generate a 3-module learning syllabus.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          displacementRisk: { type: Type.NUMBER, description: "Risk percentage from 0-100" },
          transferableSkills: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
          recommendedPivot: { type: Type.STRING },
          matchPercentage: { type: Type.NUMBER },
          syllabus: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                moduleTitle: { type: Type.STRING },
                skillsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["moduleTitle", "skillsToLearn"]
            },
            minItems: 3,
            maxItems: 3
          }
        },
        required: ["displacementRisk", "transferableSkills", "recommendedPivot", "matchPercentage", "syllabus"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
