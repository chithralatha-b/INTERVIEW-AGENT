# IntervueAI — Adaptive AI Interviewer

> An AI-powered technical interviewer that adapts its questions based on the candidate's responses and provides structured, actionable feedback at the end of the interview.

## 🚀 Overview

**IntervueAI** is an adaptive AI interview system built for the hackathon.

Instead of following a fixed list of interview questions, IntervueAI dynamically responds to the candidate's answers and adjusts the next question based on:

* Candidate profile
* Candidate experience
* Relevant curriculum topics
* Previous interview responses
* Demonstrated technical understanding

At the end of the interview, the system provides structured feedback covering:

* Summary
* Strengths
* Gaps
* Next steps

The goal is to make technical interview practice more realistic, personalized, and useful.

---

## ✨ Key Features

### 🤖 Adaptive AI Interviewer

The interviewer asks one question at a time and adapts subsequent questions based on the candidate's responses.

### 👤 Candidate-Aware Questions

The system uses the supplied candidate information to make the interview relevant to the selected candidate.

### 📚 Curriculum-Aware Interviewing

Relevant curriculum information is used to guide interview topics and question difficulty.

### 🔄 Session-Based Interview

Each interview uses a unique `sessionId` to maintain the conversation and interview state across multiple requests.

### 🧠 Dynamic Difficulty

The interviewer can adjust its questioning based on the candidate's demonstrated understanding.

Examples:

* Strong answer → deeper follow-up
* Weak answer → foundational clarification
* Vague answer → request for a concrete example
* Incorrect answer → probe the misunderstanding
* Excellent answer → increase complexity

### 📊 Structured Final Feedback

After the interview, IntervueAI generates:

* **Summary**
* **Strengths**
* **Gaps**
* **Next Steps**

### 📱 Mobile-First Design

The interface is designed primarily for a mobile viewport and remains responsive on larger screens.

### ⚡ Simple Hackathon Architecture

The project intentionally avoids unnecessary complexity such as:

* Authentication
* Persistent user accounts
* Recruiter dashboards
* Admin dashboards
* Voice/video interviews
* Multi-agent orchestration
* Unnecessary vector databases

---

## 🏗️ Architecture

```text
                         IntervueAI
                             │
             ┌───────────────┴───────────────┐
             │                               │
         Frontend                         Backend
             │                               │
       React UI                         API Server
             │                               │
     ┌───────┼────────┐              ┌───────┼────────┐
     │       │        │              │       │        │
     /   /interview /feedback   Candidate  Curriculum Gemini
                                  Data       Data      API
                                             │
                                      Session State
```

---

## 🔄 Interview Flow

```text
Landing Page
     ↓
Candidate Selection
     ↓
Candidate Profile Preview
     ↓
Start Interview
     ↓
Generate sessionId
     ↓
POST /api/interview
     ↓
AI asks question
     ↓
Candidate answers
     ↓
POST /api/interview
     ↓
AI analyzes response
     ↓
Adaptive follow-up question
     ↓
     ... repeat ...
     ↓
Interview Complete
     ↓
Structured Feedback
     ↓
Summary + Strengths + Gaps + Next Steps
```

---

## 🛠️ Technology

The application uses a modern full-stack web architecture with:

* React
* TypeScript
* Node.js server runtime
* Gemini API
* REST API
* JSON-based candidate/curriculum data
* Server-side interview session state
* Responsive CSS/UI

The application is designed to keep Gemini API credentials on the server side.

---

## 🔌 API

### POST `/api/interview`

The application exposes the required interview endpoint.

The exact request and response contract follows the hackathon's `technical.md` specification.

The endpoint is responsible for:

* Starting an interview
* Continuing an interview session
* Using candidate information
* Using relevant curriculum information
* Calling Gemini
* Returning the interviewer's response
* Determining when the interview is complete
* Returning final feedback

### Session

A unique `sessionId` identifies an interview session.

The same `sessionId` is reused throughout the interview.

---

## 🧠 AI Interview Strategy

IntervueAI is designed around adaptive interviewing rather than static question generation.

The interviewer considers the candidate's previous response before deciding what to ask next.

### Example

```text
Candidate:
"I used caching to improve API performance."

        ↓

AI analyzes response

        ↓

Follow-up:
"How did you decide what data to cache,
and how did you handle cache invalidation?"
```

The goal is to evaluate actual understanding rather than simply checking whether the candidate can repeat definitions.

---

## 📁 Project Data

The project uses hackathon-provided data for:

```text
Candidate Information
        +
Curriculum Information
        ↓
Adaptive Interview
```

The supplied data is used rather than relying on fabricated candidate profiles.

---

## 🔐 Environment Variables

The Gemini API key must remain server-side.

Required secret:

```text
GEMINI_API_KEY
```

Never expose this key in:

* Frontend code
* React components
* Browser storage
* Public environment variables
* GitHub
* README files
* API responses

---

## ▶️ Running the Project

The project can be run using the development environment provided by Google AI Studio.

General flow:

```text
Install dependencies
        ↓
Configure server-side GEMINI_API_KEY
        ↓
Start development server
        ↓
Open application
        ↓
Select candidate
        ↓
Start interview
```

---

## 🧪 Testing the Application

The complete flow should be tested:

1. Open the landing page.
2. Start an interview.
3. Select a candidate.
4. Start the interview.
5. Verify that a `sessionId` is created.
6. Verify that `/api/interview` returns an AI question.
7. Submit an answer.
8. Verify that the same `sessionId` continues the interview.
9. Verify that the AI adapts the next question.
10. Continue the interview.
11. Complete the interview.
12. Verify `done=true`.
13. Verify final feedback.
14. Open the feedback screen.
15. Verify:

* Summary
* Strengths
* Gaps
* Next Steps

Also test:

* Empty answers
* API errors
* Gemini errors
* Invalid sessions
* Missing candidate information
* Mobile viewport
* Page refresh
* Build errors

---

## 📱 User Experience

The application is designed mobile-first for approximately a **390px viewport**.

Important UX goals:

* Clear navigation
* Simple candidate selection
* Focused interview interface
* Easy answer submission
* Clear loading states
* Helpful error states
* Readable feedback
* Responsive layout

---

## 🎯 Hackathon Scope

### Included

* AI interviewer
* Adaptive questioning
* Candidate-aware interviews
* Curriculum-aware questioning
* Session-based interview flow
* Gemini integration
* Structured final feedback
* Mobile-first interface
* Required API endpoint

### Not Included

* Authentication
* Persistent user accounts
* Voice interaction
* Video interview
* Mobile native application
* Recruiter dashboard
* Admin panel
* Production database
* Real-world social integrations

---

## 💡 Why IntervueAI?

Traditional interview practice often follows a fixed question list.

IntervueAI changes that interaction into a dynamic conversation.

Instead of:

```text
Question 1
Question 2
Question 3
Question 4
```

the system follows:

```text
Candidate Answer
       ↓
AI Evaluation
       ↓
Adaptive Follow-up
       ↓
Candidate Answer
       ↓
AI Evaluation
       ↓
Deeper / Clarifying Question
```

This makes the interview more personalized and allows the system to explore the candidate's actual understanding.

---

## 🚀 Future Improvements

Possible future extensions include:

* Voice-based interviewing
* Interview history
* Persistent candidate accounts
* Advanced performance analytics
* Skill-level visualization
* More detailed competency reports
* Recruiter-facing evaluation dashboard
* Interview difficulty personalization
* Multiple interview modes

---

## 👥 Hackathon Project

**Project:** IntervueAI
**Category:** AI Interview Agent
**Core Technology:** Gemini + Full-Stack Web Application

Built as a vibe-coding hackathon project with a focus on:

**Adaptive AI + Personalized Interviewing + Actionable Feedback**
