import React, { useState, useMemo } from "react";
import { Candidate } from "../types";
import { CandidateCard } from "./CandidateCard";
import {
  Search,
  Filter,
  ArrowRight,
  UserCheck,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface CandidateSelectionProps {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onStartInterview: () => void;
}

export const CandidateSelection: React.FC<CandidateSelectionProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  onStartInterview,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Extract unique roles dynamically
  const uniqueRoles = useMemo(() => {
    const roles = candidates.map((c) => c.member.jobRole);
    return Array.from(new Set(roles));
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.member.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.member.education.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" || c.member.jobRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [candidates, searchQuery, roleFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      {/* Page Title Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Select Candidate for Interview
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Choose a candidate from the cohort dataset. IntervueAI will tailor its technical questions to their role and track record.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search candidate name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#16161e] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Role Filter Selector */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 shrink-0 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#16161e] py-2.5 pl-3 pr-8 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="ALL">All Roles ({candidates.length})</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role} className="bg-[#16161e]">
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid & Selected Profile Preview Split */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Candidate Cards Grid */}
        <div className="lg:col-span-7">
          {filteredCandidates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">
              <p className="font-medium">No candidates match your search filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("ALL");
                }}
                className="mt-2 text-xs font-semibold text-blue-400 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.member.id}
                  candidate={candidate}
                  isSelected={
                    selectedCandidate?.member.id === candidate.member.id
                  }
                  onSelect={onSelectCandidate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Profile Preview Panel */}
        <div className="lg:col-span-5">
          {selectedCandidate ? (
            <div className="sticky top-20 rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                    Candidate Profile
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedCandidate.member.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedCandidate.member.jobRole} • {selectedCandidate.member.yearsExperience} yrs exp
                  </p>
                </div>
                <span className="inline-flex items-center rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  {selectedCandidate.member.status}
                </span>
              </div>

              {/* Education & Signals Overview */}
              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between rounded-lg bg-white/5 p-3 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Education</span>
                  <span className="font-medium text-slate-200">
                    {selectedCandidate.member.education}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      <Award className="h-3.5 w-3.5" />
                      <span className="font-bold text-white">
                        {selectedCandidate.signals.commitDays}/31
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1 block">Commit Days</span>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/5 p-3 text-center">
                    <div className="font-bold text-blue-400">
                      {selectedCandidate.signals.missionsFirstTry} / {selectedCandidate.signals.missionsCompleted}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1 block">1st Try Passed</span>
                  </div>
                </div>

                {/* Missions Highlights */}
                <div className="mt-4 pt-2">
                  <h4 className="mb-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                    <span>Curriculum & Mission History</span>
                  </h4>
                  <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                    {selectedCandidate.missions.map((mission, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-white/5 border border-white/5 px-3 py-2 text-[11px]"
                      >
                        <span className="truncate text-slate-300">
                          Day {mission.day}: {mission.title}
                        </span>
                        {mission.passed ? (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-400 shrink-0">
                            <CheckCircle2 className="h-3 w-3" /> Passed
                          </span>
                        ) : mission.skipped ? (
                          <span className="inline-flex items-center gap-1 text-slate-500 shrink-0">
                            <HelpCircle className="h-3 w-3" /> Skipped
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 shrink-0">
                            <XCircle className="h-3 w-3" /> Failed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Interview Action CTA */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <button
                  onClick={onStartInterview}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-[0.99]"
                >
                  <UserCheck className="h-4 w-4 text-emerald-300" />
                  <span>Start Interview as {selectedCandidate.member.name.split(" ")[0]}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d0d14] p-8 text-center text-slate-500">
              <UserCheck className="mx-auto h-8 w-8 text-slate-600" />
              <p className="mt-2 text-sm font-medium text-slate-400">
                Select a candidate from the left grid to view their profile and launch the interview session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
