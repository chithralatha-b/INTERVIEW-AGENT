import React from "react";
import { Candidate } from "../types";
import { User, Briefcase, GraduationCap, Award, CheckCircle2 } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
}) => {
  const { member, signals } = candidate;

  // Calculate pass rate percentage safely
  const passRate =
    signals.missionsCompleted > 0
      ? Math.round((signals.missionsFirstTry / signals.missionsCompleted) * 100)
      : 0;

  // Initials for sleek avatar
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div
      onClick={() => onSelect(candidate)}
      className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${
        isSelected
          ? "border-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/30"
          : "border-white/10 bg-[#0d0d14] hover:border-blue-500/40 hover:bg-[#16161e]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-sm text-white shadow-md">
            {initials}
          </div>

          <div>
            <h3 className="font-semibold text-slate-100 sm:text-base">
              {member.name}
            </h3>
            <span className="inline-block mt-0.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {member.jobRole}
            </span>
          </div>
        </div>

        {isSelected && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* Details Row */}
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <Briefcase className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>{member.yearsExperience} yrs exp</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <GraduationCap className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{member.education}</span>
        </div>
      </div>

      {/* Signals Badge Row */}
      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-white/5 border border-white/5 px-2.5 py-1.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>{signals.commitDays} Commit Days</span>
        </div>
        <div className="font-semibold text-blue-400">
          {passRate}% 1st Try Pass
        </div>
      </div>
    </div>
  );
};
