export interface CandidateMember {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface CandidateMission {
  day: number;
  title: string;
  passed?: boolean;
  attempts?: number;
  skipped?: boolean;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface Candidate {
  member: CandidateMember;
  missions: CandidateMission[];
  signals: CandidateSignals;
}

export interface CurriculumModule {
  n: number;
  title: string;
  days: number[];
}

export interface CurriculumDay {
  day: number;
  title: string;
  type: string;
  tools: string[];
  objectives: string[];
}

export interface Curriculum {
  cohort: string;
  modules: CurriculumModule[];
  days: CurriculumDay[];
}

export interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface Message {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: number;
}

export interface InterviewSession {
  sessionId: string;
  candidate: Candidate;
  turnCount: number;
  maxTurns: number;
  conversationHistory: { role: 'interviewer' | 'candidate'; content: string }[];
  isComplete: boolean;
  feedback?: Feedback;
  createdAt: number;
}

export interface StartInterviewRequest {
  sessionId: string;
  candidate: Candidate;
}

export interface ConversationTurnRequest {
  sessionId: string;
  message: string;
}

export type InterviewRequest = StartInterviewRequest | ConversationTurnRequest;

export interface InterviewResponse {
  reply: string;
  done: boolean;
  feedback?: Feedback;
  error?: string;
}
