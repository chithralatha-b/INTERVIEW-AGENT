import React from "react";
import { Bot, Sparkles, RefreshCw } from "lucide-react";
import { Candidate } from "../types";

interface HeaderProps {
  currentView: "landing" | "candidates" | "interview" | "feedback";
  selectedCandidate: Candidate | null;
  turnCount?: number;
  maxTurns?: number;
  onNavigateHome: () => void;
  onResetSession?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedCandidate,
  turnCount = 1,
  maxTurns = 5,
  onNavigateHome,
  onResetSession,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md text-slate-100">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-8">
        {/* Brand Logo & Name */}
        <button
          onClick={onNavigateHome}
          className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-lg text-white shadow-sm transition-transform group-hover:scale-105">
            i
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-white">
                Intervue<span className="text-blue-500">AI</span>
              </span>
              <span className="inline-flex items-center rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                Adaptive
              </span>
            </div>
          </div>
        </button>

        {/* Center / Context Status */}
        {currentView === "interview" && selectedCandidate && (
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              <span className="text-xs uppercase tracking-widest text-slate-400">
                Session: {selectedCandidate.member.name}
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-slate-300">
                Q{Math.min(turnCount, maxTurns)} / {maxTurns}
              </span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {currentView === "interview" && onResetSession && (
            <button
              onClick={onResetSession}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
              title="End / Reset interview"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">End Session</span>
            </button>
          )}

          {currentView !== "candidates" && currentView !== "interview" && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg transition-colors hover:bg-blue-500"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Select Candidate</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
