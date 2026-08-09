import React, { useState, useRef, useEffect } from "react";
import { Candidate, Message } from "../types";
import {
  Send,
  Bot,
  User,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface InterviewViewProps {
  sessionId: string;
  candidate: Candidate;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  turnCount: number;
  maxTurns: number;
  onSendMessage: (text: string) => void;
  onRetry: () => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  sessionId,
  candidate,
  messages,
  isLoading,
  error,
  turnCount,
  maxTurns,
  onSendMessage,
  onRetry,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, error]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Adjust textarea height dynamically
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
  };

  const candidateInitials = candidate.member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Technical depth metric calculation based on turn count
  const depthPercentage = Math.min(95, 60 + turnCount * 7);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#0a0a0f] text-slate-100">
      {/* Sleek Sidebar - Candidate & Adaptive State (Desktop) */}
      <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-[#0d0d14] lg:flex lg:flex-col">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Candidate Profile
          </h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
              {candidateInitials}
            </div>
            <div>
              <h2 className="font-semibold text-base text-white">
                {candidate.member.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {candidate.member.jobRole}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                Experience & Education
              </p>
              <p className="text-xs text-slate-300">
                {candidate.member.yearsExperience} yrs experience • {candidate.member.education}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                Cohort Signals
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-medium rounded border border-blue-500/20">
                  {candidate.signals.commitDays} Commit Days
                </span>
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-medium rounded border border-blue-500/20">
                  {candidate.signals.missionsFirstTry} 1st-Try Passes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Engine State Panel */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">
              Adaptive Engine State
            </h3>
            <div className="space-y-3.5">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between text-[11px] mb-2 font-medium">
                  <span className="text-slate-400">Technical Depth</span>
                  <span className="text-blue-400 font-mono">{depthPercentage}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${depthPercentage}%` }}
                  />
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between text-[11px] mb-2 font-medium">
                  <span className="text-slate-400">Communication Signal</span>
                  <span className="text-emerald-400">Evaluated</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[88%]" />
                </div>
              </div>

              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-[11px] text-blue-300">
                <div className="flex items-center gap-1.5 font-semibold text-blue-400 mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Real-time Prompt Tuning</span>
                </div>
                <p className="text-[10px] leading-relaxed text-blue-200/80">
                  Questions adjust after every turn based on reasoning clarity and technical exactness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Stage */}
      <section className="flex-1 flex flex-col relative bg-[#0a0a0f] overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="lg:hidden border-b border-white/10 bg-[#0d0d14] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              {candidateInitials}
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">
                {candidate.member.name}
              </h2>
              <p className="text-[11px] text-slate-400">{candidate.member.jobRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-blue-400">
              Q{Math.min(turnCount, maxTurns)} / {maxTurns}
            </span>
          </div>
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-36">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg) => {
              const isInterviewer = msg.sender === "interviewer";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    isInterviewer ? "justify-start" : "flex-row-reverse"
                  }`}
                >
                  {isInterviewer ? (
                    <div className="w-8 h-8 rounded bg-blue-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-md mt-1">
                      AI
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-slate-700 shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-1">
                      {candidateInitials}
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                      isInterviewer
                        ? "bg-white/5 border border-white/10 rounded-tl-none text-slate-200"
                        : "bg-blue-600/10 border border-blue-500/30 rounded-tr-none text-slate-200"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between text-[10px]">
                      <span
                        className={`font-bold uppercase tracking-wider ${
                          isInterviewer ? "text-blue-400" : "text-slate-400"
                        }`}
                      >
                        {isInterviewer ? "IntervueAI" : candidate.member.name}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              );
            })}

            {/* AI Loading State */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-blue-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                  AI
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-none border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span>Analyzing response and formulating next adaptive follow-up...</span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={onRetry}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/95 to-transparent backdrop-blur-xs">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl relative">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={2}
                placeholder="Type your technical response..."
                className="w-full bg-[#16161e] border border-white/10 rounded-2xl p-4 pr-16 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="absolute right-3 bottom-3 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:cursor-not-allowed rounded-xl text-white transition-colors shadow-md active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Status Footer */}
            <div className="flex justify-center items-center gap-8 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Progress
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Question {Math.min(turnCount, maxTurns)} / {maxTurns}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Status
                </span>
                <span className="text-xs text-blue-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {isLoading ? "Evaluating Input..." : "Awaiting Input"}
                </span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
