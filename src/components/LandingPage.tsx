import React from "react";
import {
  MessageSquare,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Brain,
  Code2,
  Sparkles,
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#08080c] text-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
        {/* Ambient Blue Background Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-full -translate-x-1/2 max-w-4xl opacity-40 blur-3xl">
          <div className="h-full w-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-sky-400/20" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="uppercase tracking-widest text-[11px]">Next-Generation Technical Evaluation</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
            Meet your <span className="text-blue-500">AI interviewer.</span>
          </h1>

          {/* Supporting Text */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-xl sm:leading-relaxed">
            An adaptive interview engine that evaluates real technical depth, follows up intelligently, and produces actionable candidate feedback.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={onStart}
              className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-[0.99] sm:w-auto"
            >
              <span>Start Interview</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#features"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-slate-300 backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto"
            >
              Learn How It Works
            </a>
          </div>

          {/* Key Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Grounded in Cohort Data
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-4 w-4 text-blue-400" /> Gemini Powered
            </span>
            <span className="flex items-center gap-1.5">
              <Code2 className="h-4 w-4 text-sky-400" /> Real-time Depth Adaptation
            </span>
          </div>
        </div>
      </section>

      {/* Visual Preview Section */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d14] p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-500">intervue.ai / adaptive-session</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Live Session: #a82-f19</span>
              </div>
            </div>

            {/* Simulated Conversation */}
            <div className="mt-4 space-y-3 font-sans text-xs sm:text-sm">
              {/* AI Question */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-blue-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                  AI
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-slate-200 leading-relaxed">
                  <p>
                    &ldquo;Based on your experience as a Senior Data Engineer, how do you handle vector embeddings indexing when vector dimensionality increases from 768 to 1536 in a high-throughput RAG pipeline?&rdquo;
                  </p>
                </div>
              </div>

              {/* Candidate Answer */}
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded bg-slate-700 shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
                  SC
                </div>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl rounded-tr-none p-4 text-slate-200 leading-relaxed">
                  <p>
                    &ldquo;I prioritize HNSW index parameter tuning (m and efConstruction) and evaluate 8-bit scalar quantization to preserve RAM while maintaining top-k recall precision...&rdquo;
                  </p>
                </div>
              </div>

              {/* AI Follow-Up Adapt */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-blue-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                  AI
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-slate-200 leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded uppercase font-bold tracking-wider border border-blue-500/30">
                      Adaptive Probe
                    </span>
                    <span className="text-[10px] text-slate-500 italic">Increasing technical difficulty...</span>
                  </div>
                  <p>
                    &ldquo;That's a solid architectural choice. Let's dig deeper: how do you prevent distance calculation degradation between cosine vs Euclidean distance under 8-bit quantization?&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section id="features" className="border-t border-white/10 bg-[#0a0a0f] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineered for Realistic Technical Evaluation
            </h2>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              No static question banks. IntervueAI dynamically adjusts to candidate depth in real-time.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 transition-all hover:border-blue-500/40 hover:bg-[#16161e]">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                CONVERSATIONAL
              </h3>
              <p className="mt-1.5 text-lg font-bold text-white">
                One question at a time.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                Feels like a natural dialogue with a staff tech lead, allowing candidates to explain reasoning without cognitive overwhelm.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 transition-all hover:border-amber-500/40 hover:bg-[#16161e]">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                ADAPTIVE
              </h3>
              <p className="mt-1.5 text-lg font-bold text-white">
                Answers guide what comes next.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                Strong responses unlock complex system architecture challenges; vague answers trigger targeted scenario probes.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0d0d14] p-6 transition-all hover:border-emerald-500/40 hover:bg-[#16161e]">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                ACTIONABLE
              </h3>
              <p className="mt-1.5 text-lg font-bold text-white">
                Clear strengths, gaps & next steps.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                Receive comprehensive structured evaluation grounded in actual transcript evidence immediately upon completion.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 active:scale-95"
            >
              <span>Choose Candidate & Start Demo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
