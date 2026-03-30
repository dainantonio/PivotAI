import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ParsedProfile {
  skills: string[];
  tools: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
    achievements: string[];
  }[];
}

export interface RoleMatch {
  role: string;
  matchPercentage: number;
  keySkills: string[];
  description: string;
}

export interface GapAnalysisResult {
  skillsHave: string[];
  skillsMissing: string[];
  transferableSkills: string[];
  priorityFocus: string[];
}

export interface UpskillRecommendation {
  courses: {
    title: string;
    platform: string;
    duration: string;
    isFree: boolean;
  }[];
  projects: {
    name: string;
    description: string;
  }[];
  certificates: {
    name: string;
    progress: number;
  }[];
}

export interface ResumeRewriteResult {
  summary: string;
  experience: {
    company: string;
    role: string;
    period: string;
    bullets: string[];
  }[];
  coverLetter: string;
  linkedin: {
    headline: string;
    about: string;
  };
  projects: {
    title: string;
    description: string;
  }[];
}

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

export interface SkillGap {
  skill: string;
  currentLevel: number; // 0-100
  targetLevel: number;  // 0-100
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface CareerPath {
  displacementRisk: number;
  transferableSkills: string[];
  recommendedPivot: string;
  matchPercentage: number;
  industry?: string;
  skillGaps: SkillGap[];
  syllabus: {
    moduleTitle: string;
    skillsToLearn: string[];
  }[];
}

export const aiService = {
  async parseExperience(text: string): Promise<ParsedProfile> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Resume/Job Description Text: ${text}`,
      config: {
        systemInstruction: "Analyze the following experience and extract: Skills, Tools, Key responsibilities, Achievements. Return structured JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            tools: { type: Type.ARRAY, items: { type: Type.STRING } },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "company", "duration", "responsibilities", "achievements"]
              }
            }
          },
          required: ["skills", "tools", "experience"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async matchRoles(profile: ParsedProfile): Promise<{ matches: RoleMatch[] }> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current Profile: ${JSON.stringify(profile)}`,
      config: {
        systemInstruction: "Given this experience, match it to AI-related roles. Return exactly 5 roles with match percentage and reasoning in the description field.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  matchPercentage: { type: Type.NUMBER },
                  keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING, description: "Reasoning for the match" }
                },
                required: ["role", "matchPercentage", "keySkills", "description"]
              }
            }
          },
          required: ["matches"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeGaps(currentSkills: string[], targetRole: string): Promise<GapAnalysisResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current Skills: ${currentSkills.join(", ")}\nTarget Role: ${targetRole}`,
      config: {
        systemInstruction: "Compare this user profile with this target role. Return: Skills they have, Skills missing, Transferable skills, Priority learning areas in the priorityFocus field.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skillsHave: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillsMissing: { type: Type.ARRAY, items: { type: Type.STRING } },
            transferableSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            priorityFocus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Priority learning areas" }
          },
          required: ["skillsHave", "skillsMissing", "transferableSkills", "priorityFocus"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateUpskills(gaps: string[], targetRole: string): Promise<UpskillRecommendation> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Skill Gaps: ${gaps.join(", ")}\nTarget Role: ${targetRole}`,
      config: {
        systemInstruction: "Based on missing skills, generate: 1. 2–3 short courses (free or paid), 2. 1–2 practical projects, 3. Optional certification suggestions in the certificates field. Keep it concise and actionable.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  isFree: { type: Type.BOOLEAN }
                },
                required: ["title", "platform", "duration", "isFree"]
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["name", "description"]
              }
            },
            certificates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  progress: { type: Type.NUMBER, description: "Estimated progress if they started today (usually 0)" }
                },
                required: ["name", "progress"]
              }
            }
          },
          required: ["courses", "projects", "certificates"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async rewriteResume(profile: ParsedProfile, targetRole: string): Promise<ResumeRewriteResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Profile: ${JSON.stringify(profile)}\nTarget Role: ${targetRole}`,
      config: {
        systemInstruction: "Rewrite this experience to align with the target role. Use strong action verbs, add data/impact language, and make it ATS-friendly. Return a complete profile including resume sections, cover letter, and LinkedIn optimization.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  period: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["company", "role", "period", "bullets"]
              }
            },
            coverLetter: { type: Type.STRING },
            linkedin: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                about: { type: Type.STRING }
              },
              required: ["headline", "about"]
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["summary", "experience", "coverLetter", "linkedin", "projects"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async optimizeResume(legacyText: string, targetRole: string): Promise<OptimizedResume> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
  },

  async interview(messages: { role: string, content: string }[], currentAnswer: string, targetRole: string): Promise<InterviewResponse> {
    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          { text: `Interview History: ${JSON.stringify(history)}\n\nUser Answer: ${currentAnswer}\n\nTarget Role: ${targetRole}` }
        ]
      },
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
        },
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async generatePath(currentRole: string, industry: string): Promise<CareerPath> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Current Role: ${currentRole}\nIndustry: ${industry}`,
      config: {
        systemInstruction: "You are an AI Career Strategist. Calculate the user's risk of AI automation, identify 4 transferable skills, and recommend the best tech-adjacent pivot role. Perform a detailed skill gap analysis comparing their current role to the future needs of the pivot role. Finally, generate a 3-module learning syllabus.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            displacementRisk: { type: Type.NUMBER, description: "Risk percentage from 0-100" },
            transferableSkills: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
            recommendedPivot: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  currentLevel: { type: Type.NUMBER },
                  targetLevel: { type: Type.NUMBER },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  description: { type: Type.STRING }
                },
                required: ["skill", "currentLevel", "targetLevel", "priority", "description"]
              },
              minItems: 5,
              maxItems: 8
            },
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
          required: ["displacementRisk", "transferableSkills", "recommendedPivot", "matchPercentage", "skillGaps", "syllabus"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async generateProjectDescription(title: string, rawNotes: string, targetRole: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Project Title: ${title}\nRaw Notes: ${rawNotes}\nTarget Role: ${targetRole}`,
      config: {
        systemInstruction: `You are a Senior Technical Writer and Career Strategist. 
        Rewrite the provided raw project notes into a high-impact, professional description for a portfolio. 
        
        CRITICAL GUIDELINES:
        1. Use the 'Action-Result' framework (Situation/Task, Action, Result).
        2. Highlight transferable skills specifically relevant to the ${targetRole} role (e.g., for AI Product Strategist, focus on product-market fit, AI feasibility, stakeholder management, and data-driven decision making).
        3. Start with a strong action verb.
        4. Quantify results where possible (even if you have to infer a realistic metric based on the notes).
        5. Keep it concise: exactly 2-3 high-impact sentences.
        6. Avoid jargon unless it's specific to AI/Product management.`,
      }
    });
    return response.text || rawNotes;
  }
};
