Build the complete, functional hackathon project described below in this single Google AI Studio Build-mode project.

PROJECT:
IntervueAI — Adaptive AI Interviewer

IMPORTANT:
This is a time-limited vibe-coding hackathon.

I need a complete working application, not a static mockup.

Build everything in this one project:

* mobile-first frontend
* backend
* required HTTP API
* Gemini AI integration
* candidate data integration
* curriculum integration
* interview session state
* adaptive interview logic
* final structured feedback
* error handling
* responsive UI
* local/mock data handling
* build verification

Do not wait for another developer.

Do not leave placeholder buttons.

Do not create fake functionality where real functionality can be implemented.

==================================================
0. READ THE HACKATHON FILES FIRST
=================================

The project includes the following hackathon-provided files:

* technical.md
* candidate data file
* curriculum data file

FIRST inspect and understand all of them.

The exact contents and schemas of these files are authoritative.

MOST IMPORTANT:

technical.md is the source of truth for the required HTTP endpoint and exact request/response contract.

Do NOT invent a different API contract.

Do NOT rename required fields.

Do NOT change required request/response structures.

Inspect the ACTUAL candidate data schema.

Inspect the ACTUAL curriculum schema.

Do not invent fields that do not exist.

Do not silently replace the supplied hackathon data with fabricated data.

If a filename or extension differs from the names above, use the actual uploaded file.

==================================================

1. PRODUCT
   ==================================================

Build:

IntervueAI

An adaptive AI technical interviewer.

The application should:

1. allow a user to choose a supplied candidate
2. understand relevant candidate information
3. use relevant curriculum information
4. start an interview
5. ask one question at a time
6. evaluate the candidate's response
7. adapt the next question based on the response
8. continue the interview for a meaningful number of turns
9. end the interview
10. return structured feedback

The experience must feel like a professional AI interview rather than a generic chatbot.

==================================================
2. REQUIRED USER FLOW
=====================

Implement:

Landing Page
→ Candidate Selection
→ Interview
→ Final Feedback

Required frontend routes:

/
/interview
/feedback

If the framework requires a different internal routing implementation, preserve these user-accessible paths.

==================================================
3. LANDING PAGE /
=================

Create a polished, modern AI/SaaS landing page.

Hero:

"Meet your AI interviewer."

Supporting text:

"An adaptive interview that listens to your answers, follows up intelligently, and shows you exactly what to improve."

Primary CTA:

"Start Interview"

Add a concise explanation of:

CONVERSATIONAL
One question at a time.

ADAPTIVE
Your answers influence what comes next.

ACTIONABLE
Get clear strengths, gaps and next steps.

Add a tasteful visual preview of the interview experience.

Do NOT create:

* fake testimonials
* fake statistics
* fake recruiter claims
* fake user numbers

Keep the page concise and impressive.

==================================================
4. CANDIDATE SELECTION
======================

Use the supplied candidate data.

First inspect its real schema.

Build a clean candidate selection screen.

Display candidates using only fields actually available in the supplied data.

Where available, useful information may include:

* candidate name
* role
* experience
* education
* relevant skills
* relevant learning history

Do not assume these fields exist if they don't.

Allow the user to select a candidate.

After selection, show a concise profile preview.

Button:

"Start Interview"

==================================================
5. SESSION MANAGEMENT
=====================

When an interview begins, create a unique sessionId.

Use:

crypto.randomUUID()

Use the SAME sessionId throughout the entire interview.

Do not create a new session for every answer.

Maintain enough server-side state to support the interview, including as appropriate:

* sessionId
* selected candidate
* conversation history
* questions asked
* relevant topics
* interview status

A production database is NOT required unless technical.md explicitly requires one.

Use a simple reliable server-side in-memory session store for this hackathon.

If the server environment supports multiple requests through the same running instance, the session store should work correctly for the demo.

Handle unknown sessionId gracefully.

==================================================
6. REQUIRED BACKEND ENDPOINT
============================

Implement exactly the endpoint required by technical.md.

The expected endpoint from the challenge is:

POST /api/interview

However:

technical.md is authoritative.

Read it first and implement its exact request and response structure.

The endpoint should support the hackathon's intended flow:

FIRST REQUEST:

* sessionId
* candidate

SUBSEQUENT REQUESTS:

* sessionId
* message

The endpoint must:

* start an interview
* continue an existing session
* use candidate information
* use relevant curriculum information
* call Gemini
* return the interviewer reply
* indicate whether the interview is complete
* return final feedback when complete

Do NOT invent a second interview endpoint.

Do NOT change the required API contract.

==================================================
7. GEMINI INTEGRATION
=====================

Use Gemini for the interviewer.

Use the server-side environment secret:

GEMINI_API_KEY

Never expose the key in frontend/client code.

Never hardcode the key.

Never place it in:

* React components
* browser JavaScript
* localStorage
* sessionStorage
* public client environment variables
* JSON files
* GitHub
* README
* UI

Use the Gemini API only from the server-side runtime.

Use a current Gemini model available to this project and appropriate for a fast text interview.

Prioritize:

* low latency
* good reasoning
* low cost
* reliable structured output

Do not use unnecessary multiple models.

Do not build a multi-agent architecture.

Do not create unnecessary RAG/vector database infrastructure.

==================================================
8. AI INTERVIEWER SYSTEM
========================

Create a strong system instruction for the Gemini interviewer.

The AI is a professional adaptive technical interviewer.

Rules:

* Ask one question at a time.
* Keep questions relevant to the candidate's role.
* Consider candidate experience.
* Consider relevant candidate information.
* Use relevant curriculum topics.
* Analyze the candidate's previous response.
* Adapt the next question based on that response.
* Avoid repeating questions.
* Keep the conversation realistic.
* Do not reveal internal reasoning.
* Do not expose hidden scoring logic.
* Do not behave like a tutor.

Adaptation:

STRONG ANSWER:
Ask a deeper or more challenging follow-up.

WEAK ANSWER:
Ask a targeted foundational or clarifying question.

VAGUE ANSWER:
Ask for a concrete example.

INCORRECT ANSWER:
Probe the misunderstanding rather than immediately teaching the answer.

EXCELLENT ANSWER:
Increase complexity appropriately.

The interviewer should not ask unrelated questions merely to fill turns.

==================================================
9. PERSONALIZED INTERVIEWING
============================

Use the selected candidate's actual information.

The interviewer should feel candidate-specific.

If the candidate has relevant experience:
→ ask experience-based questions.

If the candidate has demonstrated knowledge:
→ increase difficulty.

If a relevant weakness becomes apparent:
→ probe that topic appropriately.

If the candidate demonstrates strong understanding:
→ move toward deeper technical reasoning.

Do not expose internal candidate evaluation data.

Do not send the entire candidate database to Gemini.

Only provide the selected candidate's relevant information.

==================================================
10. CURRICULUM
==============

Inspect the actual curriculum file.

Use curriculum information where relevant.

Do NOT send the entire curriculum to Gemini on every turn.

Select only relevant curriculum topics/context.

Use curriculum to help guide:

* topic selection
* relevance
* difficulty
* follow-up questions

Do not invent curriculum topics that aren't present unless the interview naturally requires general technical reasoning.

==================================================
11. INTERVIEW LENGTH
====================

Keep the interview concise enough for a hackathon demo.

Target approximately 5–7 meaningful questions/turns.

Do not create an endless interview.

When enough evidence has been gathered, complete the interview.

If technical.md defines a different completion behavior, follow technical.md.

==================================================
12. FINAL FEEDBACK
==================

When the interview is complete:

done = true

Return the exact final response required by technical.md.

The challenge expects structured feedback containing, where required:

summary
strengths
gaps
next

Feedback must be grounded in the actual interview.

Make it specific and actionable.

Avoid generic feedback such as:

"Practice more."

Instead provide concrete next steps based on what the candidate actually demonstrated.

Do not invent an overall numerical score or percentage unless technical.md requires it.

==================================================
13. STRUCTURED AI OUTPUT
========================

Where practical, use structured JSON output/schema validation for Gemini responses.

The AI interviewer should internally produce a predictable structure that the backend can safely parse.

For example, conceptually:

{
"reply": "next interviewer question",
"done": false
}

At completion:

{
"reply": "closing message",
"done": true,
"feedback": {
"summary": "...",
"strengths": ["..."],
"gaps": ["..."],
"next": ["..."]
}
}

IMPORTANT:

This is only a conceptual structure.

The EXACT structure required by technical.md must take priority.

Never expose raw model JSON to the user if the API expects a cleaner response.

Validate Gemini output before returning it from the backend.

Handle malformed model output gracefully.

==================================================
14. INTERVIEW FRONTEND
======================

Build /interview as the primary experience.

Display:

* IntervueAI branding
* candidate name
* candidate role
* interview status
* AI interviewer messages
* candidate answers
* answer input
* Send Answer button

AI and candidate messages must be visually distinct.

Use a focused professional layout.

Add:

* AI thinking/loading state
* disabled Send button during requests
* empty-answer validation
* retry on failure
* auto-scroll to latest message
* no duplicate submissions
* clean input behavior

Do not show raw API responses.

==================================================
15. FEEDBACK FRONTEND
=====================

Build /feedback.

Display:

INTERVIEW COMPLETE

SUMMARY

STRENGTHS

GAPS

NEXT STEPS

Use the actual returned backend feedback.

Do not fabricate information.

Do not add fake scores.

Provide:

"Start Another Interview"

This should return to candidate selection and allow a fresh session.

==================================================
16. MOBILE-FIRST UI
===================

This is extremely important.

The hackathon will evaluate the application on a mobile viewport around 390px.

Design mobile-first.

Ensure:

* no horizontal scrolling
* readable text
* comfortable answer field
* large tap targets
* proper spacing
* responsive cards
* responsive chat
* responsive feedback
* no clipped content
* no overflowing navigation

Then support desktop/tablet.

==================================================
17. VISUAL DESIGN
=================

Make the app feel like a premium AI interview product.

Use:

* excellent typography
* clean hierarchy
* strong spacing
* subtle borders
* polished cards
* clear CTA buttons
* restrained gradients
* subtle animations
* professional empty/loading/error states

Avoid:

* excessive glassmorphism
* excessive gradients
* excessive animation
* clutter
* generic chatbot appearance
* fake testimonials
* fake metrics

The application should look impressive in a hackathon screenshot.

==================================================
18. ERROR HANDLING
==================

Handle:

* missing candidate
* empty message
* missing sessionId
* unknown sessionId
* Gemini failure
* Gemini timeout
* malformed Gemini output
* missing GEMINI_API_KEY
* backend failure
* invalid request

Return safe user-friendly errors.

Never expose:

* API keys
* stack traces
* internal prompts
* internal reasoning
* sensitive server details

==================================================
19. API SECURITY
================

GEMINI_API_KEY must only be accessible server-side.

Do not put it in client-side environment variables.

Do not expose it to the browser.

Do not send it in API responses.

Do not log it.

Use the AI Studio server-side secret mechanism.

==================================================
20. COST AND SPEED OPTIMIZATION
===============================

This is a limited-credit hackathon.

Optimize for:

* minimal Gemini calls
* low latency
* reliable results
* simple architecture

Use approximately one Gemini request per interview turn.

Do not call Gemini unnecessarily for:

* UI rendering
* candidate listing
* static content
* navigation

Do not create:

* vector databases
* multi-agent orchestration
* unnecessary retrieval
* unnecessary embeddings
* multiple models

Keep the implementation simple.

==================================================
21. DATABASE / PERSISTENCE
==========================

Do NOT add a production database unless technical.md explicitly requires one.

The challenge explicitly does not require persistent user accounts.

Use:

* supplied JSON data for candidates/curriculum
* server-side session state for active interviews

If you need a tiny data abstraction, create a clean service layer around the supplied data.

Do not add authentication.

==================================================
22. ACCESSIBILITY
=================

Make important controls accessible.

Use:

* readable contrast
* proper button labels
* keyboard-accessible controls
* visible focus states
* appropriate form labels
* semantic HTML where practical

==================================================
23. DO NOT OVERBUILD
====================

Do NOT add:

* login/signup
* user accounts
* recruiter dashboard
* admin dashboard
* social authentication
* payments
* voice interaction
* video interview
* email system
* notifications
* production analytics
* unnecessary database
* unnecessary third-party services

Focus entirely on the hackathon's interview-agent requirements.

==================================================
24. END-TO-END TESTING
======================

After generating the project, DO NOT stop at code generation.

Run the application and verify the complete flow.

Test:

1. Open /
2. Click Start Interview.
3. Candidate selection appears.
4. Select an actual supplied candidate.
5. Start interview.
6. sessionId is created.
7. POST /api/interview works.
8. Gemini generates the first interviewer question.
9. Question appears in the UI.
10. Candidate enters an answer.
11. Answer is submitted.
12. Same sessionId is reused.
13. POST /api/interview continues the session.
14. Gemini adapts the next question.
15. Continue several turns.
16. Interview eventually completes.
17. done=true is returned.
18. Final feedback is returned.
19. /feedback displays summary.
20. /feedback displays strengths.
21. /feedback displays gaps.
22. /feedback displays next steps.
23. Start Another Interview works.
24. A new sessionId is generated.

Also test:

* empty answer
* API failure
* Gemini failure
* malformed response
* unknown session
* missing candidate information
* mobile viewport around 390px
* page refresh
* build

==================================================
25. AUTOMATIC ERROR FIXING
==========================

After implementation:

Run the build.

Inspect compiler errors.

Inspect runtime errors.

Inspect browser console errors.

Inspect server errors.

Fix actual errors.

Then run the build again.

Repeat until the application builds successfully.

Do not leave known errors unresolved.

Do not rewrite working features unnecessarily.

==================================================
26. HACKATHON SUBMISSION READINESS
==================================

Make sure the final project is:

* functional
* polished
* mobile-first
* demonstrable
* easy to understand
* connected end-to-end
* using actual supplied candidate/curriculum data
* using Gemini
* implementing the required endpoint
* producing final structured feedback

Also ensure the application can be exported to GitHub and deployed.

==================================================
27. FINAL INSTRUCTION
=====================

Build the COMPLETE APPLICATION NOW.

Do not only create the frontend.

Do not only create a prototype.

Do not stop after generating files.

Implement:

FRONTEND
+
BACKEND
+
POST /api/interview
+
GEMINI
+
CANDIDATE DATA
+
CURRICULUM
+
SESSION STATE
+
ADAPTIVE INTERVIEW
+
FINAL FEEDBACK
+
ERROR HANDLING
+
MOBILE UI

Use the uploaded hackathon files as the source of truth.

Read technical.md before implementing the API.

Use GEMINI_API_KEY securely on the server.

Run and verify the complete application.

Fix build/runtime issues before finishing.

Prioritize a reliable working MVP over unnecessary features.
