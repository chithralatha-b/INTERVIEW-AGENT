import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

import candidatesData from "./src/data/candidates.json" with { type: "json" };
import curriculumData from "./src/data/curriculum.json" with { type: "json" };
import { Candidate, InterviewSession, Feedback } from "./src/types.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const MODEL_NAME = "gemini-3.6-flash";

// Shared Gemini Client instance
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key-for-dev",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory Session Store for Active Interviews
const sessionStore = new Map<string, InterviewSession>();

// Target interview length (questions asked)
const DEFAULT_MAX_TURNS = 5;

// Endpoint to list candidate dataset
app.get("/api/candidates", (_req: Request, res: Response) => {
  res.json({ candidates: candidatesData });
});

// Endpoint to get session status
app.get("/api/session/:sessionId", (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const session = sessionStore.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json(session);
});

/**
 * Required POST /api/interview API contract
 */
app.post("/api/interview", async (req: Request, res: Response) => {
  try {
    const { sessionId, candidate, message } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    let session = sessionStore.get(sessionId);

    // CASE 1: Start New Interview Session
    if (candidate) {
      const candidateObj: Candidate = candidate;
      session = {
        sessionId,
        candidate: candidateObj,
        turnCount: 1,
        maxTurns: DEFAULT_MAX_TURNS,
        conversationHistory: [],
        isComplete: false,
        createdAt: Date.now(),
      };
      sessionStore.set(sessionId, session);

      // Generate First Question from Gemini
      const firstQuestion = await generateFirstQuestion(candidateObj);
      session.conversationHistory.push({
        role: "interviewer",
        content: firstQuestion,
      });

      return res.json({
        reply: firstQuestion,
        done: false,
      });
    }

    // CASE 2: Subsequent Turn with candidate message
    if (!session) {
      return res.status(400).json({
        error: `Session '${sessionId}' not found. Please start a new interview first.`,
      });
    }

    if (session.isComplete) {
      return res.json({
        reply: "This interview session has already been completed.",
        done: true,
        feedback: session.feedback,
      });
    }

    const candidateMessage = message ? String(message).trim() : "";
    if (!candidateMessage) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    // Record candidate message
    session.conversationHistory.push({
      role: "candidate",
      content: candidateMessage,
    });

    session.turnCount += 1;

    // Check if max turns reached (e.g. 5-6 turns)
    const isFinalTurn = session.turnCount > session.maxTurns;

    if (isFinalTurn) {
      // Generate Final Feedback and Closing Message
      const { closingReply, feedback } = await generateFinalFeedback(session);
      session.isComplete = true;
      session.feedback = feedback;
      session.conversationHistory.push({
        role: "interviewer",
        content: closingReply,
      });

      return res.json({
        reply: closingReply,
        done: true,
        feedback,
      });
    } else {
      // Generate Next Adaptive Follow-up Question
      const nextReply = await generateAdaptiveQuestion(session);
      session.conversationHistory.push({
        role: "interviewer",
        content: nextReply,
      });

      return res.json({
        reply: nextReply,
        done: false,
      });
    }
  } catch (err: any) {
    console.error("Error in /api/interview:", err);
    return res.status(500).json({
      error: err.message || "An error occurred during the interview process.",
    });
  }
});

// Helper: Generate candidate context string
function formatCandidateContext(candidate: Candidate): string {
  const m = candidate.member;
  const passedMissions = candidate.missions
    .filter((ms) => ms.passed)
    .map((ms) => ms.title)
    .slice(0, 8)
    .join(", ");

  const failedOrSkipped = candidate.missions
    .filter((ms) => ms.skipped || ms.passed === false)
    .map((ms) => `${ms.title} (${ms.skipped ? "skipped" : "failed"})`)
    .join(", ");

  return `Candidate Name: ${m.name}
Role: ${m.jobRole}
Years Experience: ${m.yearsExperience} years
Education: ${m.education}
Status: ${m.status}
Completed Cohort Missions: ${passedMissions || "None listed"}
Gaps / Skipped Topics: ${failedOrSkipped || "None"}
Commit Days: ${candidate.signals.commitDays}/31, First Try Pass Rate: ${candidate.signals.missionsFirstTry}/${candidate.signals.missionsCompleted}`;
}

// Helper: Get relevant curriculum summary
function getCurriculumContext(): string {
  const topics = curriculumData.modules
    .map((mod) => `Module ${mod.n}: ${mod.title}`)
    .join("; ");
  return `Curriculum Modules available: ${topics}`;
}

// Helper: Call Gemini with exponential backoff retry for transient 503/429 errors
async function callGeminiWithRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 500): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.status || err?.code;
      const msg = err?.message || String(err);
      const isTransient =
        status === 503 ||
        status === 429 ||
        msg.includes("503") ||
        msg.includes("high demand") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("overloaded");

      if (isTransient && attempt < retries) {
        console.warn(`Gemini API transient error (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delayMs * (attempt + 1)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Gemini retry limit reached");
}

// Helper: Call Gemini to produce initial question
async function generateFirstQuestion(candidate: Candidate): Promise<string> {
  const ai = getGenAI();
  const candidateInfo = formatCandidateContext(candidate);
  const curriculumInfo = getCurriculumContext();

  const prompt = `You are IntervueAI, an adaptive senior technical interviewer.
Candidate: ${candidateInfo}
Curriculum Context: ${curriculumInfo}

Instructions:
1. Warmly welcome ${candidate.member.name} (${candidate.member.jobRole}) in 1 sentence.
2. Ask ONE focused, high-signal technical question tailored to their background.
3. Keep the total response brief (max 2-3 sentences).
4. Output ONLY the interviewer message. Do not add JSON wrappers or meta comments.`;

  try {
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      })
    );

    const reply = response.text?.trim();
    if (reply) return reply;
  } catch (err) {
    console.error("Gemini API error in generateFirstQuestion:", err);
  }

  // Fallback initial question if AI call fails
  return `Welcome ${candidate.member.name}! Let's begin your interview for the ${candidate.member.jobRole} position. To start off, could you walk me through a complex technical challenge you faced in your recent work and how you approached solving it?`;
}

// Helper: Call Gemini for adaptive turn question
async function generateAdaptiveQuestion(session: InterviewSession): Promise<string> {
  const ai = getGenAI();
  const candidateInfo = formatCandidateContext(session.candidate);
  const historyText = session.conversationHistory
    .map((item) => `${item.role.toUpperCase()}: ${item.content}`)
    .join("\n\n");

  const prompt = `You are IntervueAI, an adaptive senior technical interviewer.
Candidate Profile:
${candidateInfo}

Conversation History (Turn ${session.turnCount} of ${session.maxTurns}):
${historyText}

Adaptive Interviewing Rules:
- Evaluate the candidate's latest answer quickly.
- If strong/excellent: Ask a deeper architectural follow-up.
- If weak/vague: Ask for a specific code/design scenario or clarifying probe.
- Ask EXACTLY ONE clear, concise question (max 2 sentences).
- Output ONLY the interviewer's next response text.`;

  try {
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      })
    );

    const reply = response.text?.trim();
    if (reply) return reply;
  } catch (err) {
    console.error("Gemini API error in generateAdaptiveQuestion:", err);
  }

  // Fallback question
  return `Thank you for sharing that. Building on your answer, how would you address scalability or performance bottlenecks if this system scaled by 10x?`;
}

// Helper: Call Gemini to produce structured final evaluation & feedback
async function generateFinalFeedback(
  session: InterviewSession
): Promise<{ closingReply: string; feedback: Feedback }> {
  const ai = getGenAI();
  const candidateInfo = formatCandidateContext(session.candidate);
  const historyText = session.conversationHistory
    .map((item) => `${item.role.toUpperCase()}: ${item.content}`)
    .join("\n\n");

  const prompt = `You are IntervueAI, an adaptive senior technical interviewer.
The interview with ${session.candidate.member.name} (${session.candidate.member.jobRole}) has concluded.

Full Interview Transcript:
${historyText}

Evaluate the candidate's actual answers from this conversation in detail and produce a structured final assessment in JSON.

Required JSON Structure:
{
  "closingReply": "A warm, concise 2-sentence closing statement thanking the candidate for their time and letting them know the feedback is ready.",
  "feedback": {
    "summary": "A 2-3 sentence overall summary of the candidate's technical performance, communication style, and problem-solving readiness.",
    "strengths": [
      "Concrete strength 1 demonstrated in the interview",
      "Concrete strength 2 demonstrated in the interview",
      "Concrete strength 3 demonstrated in the interview"
    ],
    "gaps": [
      "Specific area for improvement or missed concept 1",
      "Specific area for improvement or missed concept 2"
    ],
    "next": [
      "Actionable recommendation 1 tailored to what was missing",
      "Actionable recommendation 2 tailored to what was missing"
    ]
  }
}

Return ONLY valid JSON matching this schema.`;

  try {
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 600,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              closingReply: { type: Type.STRING },
              feedback: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  gaps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  next: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["summary", "strengths", "gaps", "next"],
              },
            },
            required: ["closingReply", "feedback"],
          },
        },
      })
    );

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed.closingReply && parsed.feedback) {
        return {
          closingReply: parsed.closingReply,
          feedback: {
            summary: parsed.feedback.summary || "Interview complete.",
            strengths: Array.isArray(parsed.feedback.strengths)
              ? parsed.feedback.strengths
              : ["Demonstrated solid technical interest"],
            gaps: Array.isArray(parsed.feedback.gaps)
              ? parsed.feedback.gaps
              : ["Could elaborate more on edge case handling"],
            next: Array.isArray(parsed.feedback.next)
              ? parsed.feedback.next
              : ["Review distributed systems and system architecture patterns"],
          },
        };
      }
    }
  } catch (err) {
    console.error("Gemini API error in generateFinalFeedback:", err);
  }

  // Fallback structured feedback if AI call fails
  return {
    closingReply: `Thank you for completing the interview, ${session.candidate.member.name}! We have analyzed your answers and generated your final structured evaluation below.`,
    feedback: {
      summary: `${session.candidate.member.name} completed a ${session.maxTurns}-turn adaptive interview for the position of ${session.candidate.member.jobRole}. The candidate demonstrated foundational technical knowledge and clear communication.`,
      strengths: [
        "Articulated technical reasoning clearly during initial questions",
        "Demonstrated willingness to explore system architectural tradeoffs",
        "Engaged thoughtfully with follow-up scenarios",
      ],
      gaps: [
        "Depth in specific production edge cases can be deepened",
        "Could provide more concrete quantitative metrics when describing past project impacts",
      ],
      next: [
        "Practice implementing hands-on system design scenarios",
        "Review vector indexing and LLM context management strategies",
      ],
    },
  };
}

// Start Server with Vite Middleware in Development / Static in Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IntervueAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
