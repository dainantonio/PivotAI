import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ParsedProfile {
  currentRole: string;
  industry: string;
  skills: string[];
  tools: string[];
  yearsOfExperience: string;
  repetitiveTasks: string[];
  decisionMakingLevel: string;
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
  description: string;
  credibility: string;
  salaryRange?: string;
  keySkills: string[];
}

export interface GapAnalysisResult {
  skillsHave: string[];
  skillsMissing: string[];
  transferableSkills: string[];
  priorityFocus: string[];
  reframedExperience: {
    past: string;
    mapsTo: string;
  }[];
}

export interface ExecutionPlan {
  days: {
    day: number;
    task: string;
    tools: string[];
    output: string;
    timeEstimate: string;
  }[];
  finalDeliverables: {
    project: string;
    resumeBullet: string;
  };
}

export interface UpskillRecommendation {
  courses: {
    title: string;
    platform: string;
    duration: string;
    isFree: boolean;
    pairedProject: string;
  }[];
  projects: {
    name: string;
    description: string;
    tools: string[];
    outcome: string;
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
      contents: `User Input/Resume: ${text}`,
      config: {
        systemInstruction: `Analyze the following user input and extract:
        - Current Role
        - Industry
        - Key Skills (technical + soft)
        - Tools Used
        - Years of Experience (estimate if needed)
        - Repetitive Tasks (automation opportunities)
        - Decision-Making Level
        - Detailed Experience History
        
        If missing information, infer intelligently based on the context. Return structured JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentRole: { type: Type.STRING },
            industry: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Combined technical and soft skills" },
            tools: { type: Type.ARRAY, items: { type: Type.STRING } },
            yearsOfExperience: { type: Type.STRING },
            repetitiveTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            decisionMakingLevel: { type: Type.STRING },
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
          required: ["currentRole", "industry", "skills", "tools", "yearsOfExperience", "repetitiveTasks", "decisionMakingLevel", "experience"]
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
        systemInstruction: `You are an AI Career Transformation Strategist. Based on the user's background, identify the TOP 3 AI-adjacent roles they can realistically transition into within 30–90 days.
        
        Rules:
        - MUST leverage existing skills
        - MUST NOT require advanced coding unless already present
        - MUST be in-demand roles
        
        For each role, return:
        - Role Title
        - Match Score (0–100)
        - Why it's a strong match (specific) in the description field
        - What makes them credible TODAY (important) in the credibility field
        - Salary range (optional) in the salaryRange field
        - Key skills required for the role`,
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
                  description: { type: Type.STRING, description: "Why it's a strong match" },
                  credibility: { type: Type.STRING, description: "What makes them credible TODAY" },
                  salaryRange: { type: Type.STRING },
                  keySkills: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["role", "matchPercentage", "description", "credibility", "keySkills"]
              },
              maxItems: 3
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
        systemInstruction: `You are an AI Career Transformation Strategist. Compare the user's current skills with the target role.
        
        Return:
        1. Transferable Skills: Rename them in an AI context (e.g., 'Project Management' -> 'AI Lifecycle Orchestration').
        2. Missing Skills: List ONLY the most critical ones (max 5).
        3. Reframed Experience: Show how their past specifically maps to the new role.
        
        IMPORTANT:
        - Do NOT list more than 5 missing skills.
        - Reframe EVERYTHING positively. Focus on the strength of their existing background.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skillsHave: { type: Type.ARRAY, items: { type: Type.STRING } },
            skillsMissing: { type: Type.ARRAY, items: { type: Type.STRING }, maxItems: 5 },
            transferableSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills renamed in AI context" },
            priorityFocus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 priority learning areas" },
            reframedExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  past: { type: Type.STRING, description: "Original experience/skill" },
                  mapsTo: { type: Type.STRING, description: "How it translates to the AI role" }
                },
                required: ["past", "mapsTo"]
              }
            }
          },
          required: ["skillsHave", "skillsMissing", "transferableSkills", "priorityFocus", "reframedExperience"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateExecutionPlan(profile: ParsedProfile, targetRole: string, gaps: string[]): Promise<ExecutionPlan> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Profile: ${JSON.stringify(profile)}\nTarget Role: ${targetRole}\nSkill Gaps: ${gaps.join(", ")}`,
      config: {
        systemInstruction: `You are an AI Career Transformation Strategist. Create a 7-day rapid execution plan to move the user toward the selected role.
        
        Each day must include:
        - Task (clear and short)
        - Tool(s) to use
        - Output (what they will produce)
        - Time estimate (MUST be under 2 hours)
        
        Day 7 MUST produce:
        - A portfolio-ready project
        - At least 1 resume bullet
        
        Focus on high-ROI actions that leverage their existing background. Return structured JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  task: { type: Type.STRING },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  output: { type: Type.STRING },
                  timeEstimate: { type: Type.STRING }
                },
                required: ["day", "task", "tools", "output", "timeEstimate"]
              },
              minItems: 7,
              maxItems: 7
            },
            finalDeliverables: {
              type: Type.OBJECT,
              properties: {
                project: { type: Type.STRING },
                resumeBullet: { type: Type.STRING }
              },
              required: ["project", "resumeBullet"]
            }
          },
          required: ["days", "finalDeliverables"]
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
        systemInstruction: "You are an AI Career Transformation Strategist. Based on missing skills, generate exactly 3 high-impact actions: 1. 2-3 short courses (Coursera, Udemy, edX, Google) ALWAYS paired with a specific PROJECT, 2. 1-2 practical resume-ready projects with specific tools (ChatGPT, Excel, Python, etc.) and clear outcomes, 3. Optional high-ROI certifications. Every recommendation must result in something the user can add to their resume within 7 days. Avoid generic advice.",
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
                  isFree: { type: Type.BOOLEAN },
                  pairedProject: { type: Type.STRING, description: "A specific project to complete alongside this course" }
                },
                required: ["title", "platform", "duration", "isFree", "pairedProject"]
              },
              maxItems: 3
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific tools used (e.g., ChatGPT, Excel, Python)" },
                  outcome: { type: Type.STRING, description: "Clear, tangible outcome for the resume" }
                },
                required: ["name", "description", "tools", "outcome"]
              },
              maxItems: 2
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
              },
              maxItems: 1
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
        systemInstruction: "You are an AI Career Transformation Strategist. Rewrite this experience to align with the target role. Use strong action verbs, add data/impact language, and make it ATS-friendly. Focus on TRANSFERABLE SKILLS and AI-readiness. Return a complete profile including resume sections, cover letter, and LinkedIn optimization.",
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
        systemInstruction: "You are an AI Career Transformation Strategist. Calculate AI displacement risk, identify 4 key transferable skills, and recommend a high-ROI AI-adjacent pivot. Perform a gap analysis and generate a 3-module syllabus designed for rapid 7-day progress. Focus on specific tools and tangible deliverables.",
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
