import React from "react";
import { Candidate, Feedback } from "../types";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRightCircle,
  RefreshCw,
  Award,
  Sparkles,
  FileCheck,
  User,
} from "lucide-react";

interface FeedbackViewProps {
  candidate: Candidate;
  feedback: Feedback;
  onStartAnother: () => void;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  candidate,
  feedback,
  onStartAnother,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 text-slate-100">
      {/* Header Banner */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#0d0d14] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>INTERVIEW EVALUATION COMPLETE</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Candidate Assessment Report
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Candidate: <span className="font-semibold text-white">{candidate.member.name}</span> • {candidate.member.jobRole}
            </p>
          </div>

          <button
            onClick={onStartAnother}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Start Another Interview</span>
          </button>
        </div>
      </div>

      {/* Structured Feedback Sections */}
      <div className="space-y-6">
        {/* SUMMARY CARD */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-md">
          <div className="mb-3 flex items-center gap-2 text-blue-400">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-blue-400">
              Executive Evaluation Summary
            </h2>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-sm leading-relaxed text-slate-200">
            {feedback.summary}
          </div>
        </div>

        {/* Grid for Strengths and Gaps */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* STRENGTHS */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-md">
            <div className="mb-4 flex items-center gap-2 text-emerald-400">
              <Award className="h-5 w-5" />
              <h2 className="text-[10px] font-bold tracking-widest uppercase">
                Demonstrated Strengths
              </h2>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {feedback.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 rounded-lg bg-white/5 p-3 border border-white/5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* GAPS */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-md">
            <div className="mb-4 flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-[10px] font-bold tracking-widest uppercase">
                Areas for Growth & Gaps
              </h2>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {feedback.gaps.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 rounded-lg bg-white/5 p-3 border border-white/5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NEXT STEPS */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-md">
          <div className="mb-4 flex items-center gap-2 text-blue-400">
            <ArrowRightCircle className="h-5 w-5" />
            <h2 className="text-[10px] font-bold tracking-widest uppercase">
              Actionable Next Steps
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {feedback.next.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5 text-xs sm:text-sm text-slate-300"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-xs font-bold text-blue-400 border border-blue-500/30">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <div className="text-xs text-slate-500">
            Evaluation stored in session memory for candidate <span className="font-semibold text-slate-300">{candidate.member.name}</span>.
          </div>

          <button
            onClick={onStartAnother}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95 sm:w-auto"
          >
            <User className="h-4 w-4" />
            <span>Select Another Candidate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
