import React, { useState, useEffect, useCallback } from "react";
import candidatesData from "./data/candidates.json";
import { Candidate, Message, Feedback, InterviewResponse } from "./types";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { CandidateSelection } from "./components/CandidateSelection";
import { InterviewView } from "./components/InterviewView";
import { FeedbackView } from "./components/FeedbackView";

export default function App() {
  const [currentView, setCurrentView] = useState<
    "landing" | "candidates" | "interview" | "feedback"
  >("landing");

  const [candidates] = useState<Candidate[]>(candidatesData as Candidate[]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    (candidatesData[0] as Candidate) || null
  );

  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [turnCount, setTurnCount] = useState<number>(1);
  const maxTurns = 5;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Sync browser path with currentView
  const navigateTo = useCallback((view: "landing" | "candidates" | "interview" | "feedback") => {
    setCurrentView(view);
    let path = "/";
    if (view === "interview") path = "/interview";
    if (view === "feedback") path = "/feedback";

    if (window.location.pathname !== path) {
      window.history.pushState({ view }, "", path);
    }
  }, []);

  // Handle browser popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/interview" && messages.length > 0) {
        setCurrentView("interview");
      } else if (path === "/feedback" && feedback) {
        setCurrentView("feedback");
      } else {
        setCurrentView("landing");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [messages.length, feedback]);

  // Start new interview session
  const handleStartInterview = async () => {
    if (!selectedCandidate) return;

    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setMessages([]);
    setTurnCount(1);
    setFeedback(null);
    setError(null);
    setIsLoading(true);

    navigateTo("interview");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: newSessionId,
          candidate: selectedCandidate,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to initialize interview session.");
      }

      const data: InterviewResponse = await res.json();

      const initialMessage: Message = {
        id: crypto.randomUUID(),
        sender: "interviewer",
        text: data.reply,
        timestamp: Date.now(),
      };

      setMessages([initialMessage]);
    } catch (err: any) {
      console.error("Error starting interview:", err);
      setError(err.message || "Could not connect to IntervueAI backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Send candidate answer turn
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "candidate",
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to process interview response.");
      }

      const data: InterviewResponse = await res.json();

      const aiReplyMsg: Message = {
        id: crypto.randomUUID(),
        sender: "interviewer",
        text: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiReplyMsg]);

      if (data.done && data.feedback) {
        setFeedback(data.feedback);
        setTimeout(() => {
          navigateTo("feedback");
        }, 300);
      } else {
        setTurnCount((prev) => prev + 1);
      }
    } catch (err: any) {
      console.error("Error submitting answer:", err);
      setError(err.message || "Error reaching IntervueAI server. Please try retrying.");
    } finally {
      setIsLoading(false);
    }
  };

  // Retry last turn if error
  const handleRetry = () => {
    if (messages.length === 0) {
      handleStartInterview();
      return;
    }

    const lastUserMsg = [...messages].reverse().find((m) => m.sender === "candidate");
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    } else {
      handleStartInterview();
    }
  };

  // Reset to Candidate Selection
  const handleResetSession = () => {
    setMessages([]);
    setFeedback(null);
    setError(null);
    setSessionId(crypto.randomUUID());
    navigateTo("candidates");
  };

  return (
    <div className="min-h-screen bg-[#08080c] font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        currentView={currentView}
        selectedCandidate={selectedCandidate}
        turnCount={turnCount}
        maxTurns={maxTurns}
        onNavigateHome={() => navigateTo("landing")}
        onResetSession={handleResetSession}
      />

      {/* View Switcher */}
      <main>
        {currentView === "landing" && (
          <LandingPage onStart={() => navigateTo("candidates")} />
        )}

        {currentView === "candidates" && (
          <CandidateSelection
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={(c) => setSelectedCandidate(c)}
            onStartInterview={handleStartInterview}
          />
        )}

        {currentView === "interview" && selectedCandidate && (
          <InterviewView
            sessionId={sessionId}
            candidate={selectedCandidate}
            messages={messages}
            isLoading={isLoading}
            error={error}
            turnCount={turnCount}
            maxTurns={maxTurns}
            onSendMessage={handleSendMessage}
            onRetry={handleRetry}
          />
        )}

        {currentView === "feedback" && selectedCandidate && feedback && (
          <FeedbackView
            candidate={selectedCandidate}
            feedback={feedback}
            onStartAnother={handleResetSession}
          />
        )}
      </main>
    </div>
  );
}
