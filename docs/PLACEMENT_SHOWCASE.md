# Placement Showcase & Interview Study Guide — PrepEdge AI

> **Placement Readiness Summary**: This document provides everything needed to present PrepEdge AI on your resume, explain its technical architecture during technical interview rounds, whiteboard system design, and answer behavioral & system engineering questions for campus placement drives and recruiter evaluations.

---

## 1. Resume Bullet Points (Copy-Paste Ready)

Use these bullet points for your resume under **Projects**:

### Option A: Full-Stack / Software Engineering Focus
* **PrepEdge AI — AI-Powered Mock Interview Platform** | *React 19, Vite, Express, Node.js, MongoDB, Firebase Auth, Groq, Gemini*
  - Designed and built a full-stack monorepo platform that conducts adaptive mock interviews with personalized AI question generation, voice-to-text transcription (Groq Whisper), and automated scoring reports.
  - Architected an async job execution model returning **HTTP 202 Accepted** with polling mechanisms for AI task processing, eliminating main-thread HTTP request blocking for long LLM inferences (5–15s).
  - Implemented multi-provider AI resilience with automated fallback chains (Groq ⚡ → Gemini 🤖 → Hugging Face 🤗), XML delimiter wrapping, and Zod output schema enforcement against prompt injection and bad JSON returns.
  - Engineered zero-trust backend security including server-side quota enforcement (daily practice caps, monthly resume limits), `X-Request-Id` tracing, and uniform `{ data, error }` API envelopes with 78 unit test cases (100% pass rate).

### Option B: Concise / 3-Bullet Resume Version
* **PrepEdge AI — Full-Stack Mock Interview Platform**
  - Built a scalable monorepo application using React 19, Express 5, MongoDB, and Firebase Auth to automate technical & behavioral interview practice.
  - Integrated server-side Groq Whisper STT proxy and multi-provider AI fallback chains with strict prompt sanitization and output schema validation.
  - Standardized unified API error handling and request tracing (`X-Request-Id`), backed by 78 unit tests and 0 lint warnings.

---

## 2. 30-Second Elevator Pitch & 2-Minute Walkthrough

### 30-Second Elevator Pitch (For HR / Opening Question)
> "PrepEdge AI is an AI-powered mock interview platform that helps candidates practice role-specific technical and behavioral interviews. It parses resumes and job descriptions to generate tailored questions, records voice or text answers, transcribes speech using Groq Whisper, and outputs detailed feedback reports with score analytics. I built it with a React 19 frontend, Express 5 REST API, MongoDB Atlas, and Firebase Auth, engineered around async job polling and multi-provider AI fallbacks to stay 100% resilient on free-tier infrastructure."

### 2-Minute Technical Walkthrough (For Technical Round)
1. **Core Problem**: Candidates struggle with unstructured interview prep without objective feedback or realistic constraints.
2. **System Architecture**: Monorepo structure (`apps/web`, `apps/api`, `packages/shared`). Web client communicates via HTTPS Bearer JWTs to Express. Shared Zod schemas guarantee single-source contract validation across client and server.
3. **Async Interview Engine**:
   - `POST /api/interviews/setup` returns 202 immediately while `generateQuestionsAsync` runs in the background.
   - Resume PDFs are parsed via `pdf-parse` and cached using 7-day file hashes to minimize LLM token costs.
   - Answer submission is processed asynchronously; `scoreAnswerAsync` calculates per-question scores, filler words/WPM speech metrics, and final report summaries.
4. **AI Reliability & Security**: Prompts wrap untrusted inputs in XML tags (`<user_answer>`, `<resume_text>`) and run through `assertSafeForAi`. If Groq or Gemini 429s or fails JSON parsing, fallback providers execute seamlessly.
5. **Quality & Discipline**: 78 unit tests in Vitest covering quotas, schemas, middleware, report generation, and speech metrics; 0 lint errors; Vite production build verified.

---

## 3. Whiteboard System Architecture

Be prepared to sketch this during technical whiteboard rounds:

```
+-------------------------------------------------------------------------+
|                              FRONTEND                                   |
|   React 19 + Vite 6 + Tailwind CSS + TanStack Query + React Router 7     |
|   - Theme Toggle (Light/Dark)  - Audio Recording (Groq STT)             |
+-------------------------------------------------------------------------+
                                    |
                    HTTPS + Bearer Firebase Auth Token
                                    v
+-------------------------------------------------------------------------+
|                             BACKEND API                                 |
|   Express 5 + Node.js (Monorepo)                                        |
|   - Envelope Middleware: { data, error }                                |
|   - Request Logger & X-Request-Id Tracing                               |
|   - Rate Limiter & Usage Quota Engine (MongoDB Counters)                |
+-------------------------------------------------------------------------+
     /                             |                             \
    v                              v                              v
+-------------------+    +--------------------+    +----------------------+
| MongoDB Atlas     |    | Firebase Admin SDK |    | Multi-Provider AI    |
| - Users & Quotas  |    | - Token Verification|    | - Groq (Whisper STT) |
| - Interviews      |    | - Custom Tokens    |    | - Gemini / HF        |
| - Reports & Share |    +--------------------+    | - Fallback Chains    |
+-------------------+                              +----------------------+
```

---

## 4. Key Placement Technical QA Cheat Sheet

| Question | Answer Summary |
|----------|----------------|
| **Q: How do you handle LLM latency on HTTP requests?** | We use an **Async Task & Polling Architecture**. Long-running AI operations return `202 Accepted` immediately, set document status to `"generating"` or `"pending"`, execute in background, and frontend polls status via `useQuery`. |
| **Q: How do you prevent AI Prompt Injection?** | We use **Input Sanitization & XML Delimiting**. Untrusted resume/job description/answer strings are stripped of null bytes/control chars, scanned for injection patterns, and explicitly wrapped in `<user_answer>` tags in system prompts. |
| **Q: Why use a Monorepo with `@prepedge/shared`?** | To share Zod validation schemas, quota calculations, error codes, and speech analysis logic between `apps/api` and `apps/web` without duplicated code or schema drift. |
| **Q: How does user authentication work securely?** | Client authenticates via Firebase Auth. Requests attach JWT in `Authorization: Bearer <token>`. Server middleware verifies JWT using `firebase-admin`, extracting `uid` to lock MongoDB queries to the authenticated user. |
| **Q: How are server usage quotas enforced?** | `UserModel` tracks monthly interview limits, daily practice limits, and daily STT limits. `quotaService` checks limits before executing costly AI actions and returns a standard `rate_limited` envelope if exceeded. |
| **Q: What testing & linting standards exist?** | Vitest suite in `apps/api` runs 78 automated tests across 14 test modules testing error handling, quota logic, schema sanitization, speech metrics, and demo accounts. ESLint passes with 0 errors across the monorepo. |

---

## 5. Recruiter Demo Walkthrough Checklist

When demoing the project to an interviewer or recruiter:
1. **Homepage Hero**: Point out the Vercel-inspired dark/light theme, modern typography (Inter), and clear CTA buttons.
2. **Sample Question Card**: Show that recruiters can test AI answer scoring directly on the landing page without logging in.
3. **Magic-Link Demo Account**: Click "View Demo" to instantly log in as a pre-populated recruiter account with pre-filled interview reports and score rings.
4. **Interview Creation**: Show template selection (Software Engineer, System Design, STAR Behavioral) and usage cap indicator badges.
5. **Speech & Analytics**: Record audio or type text, show real-time waveform, WPM/filler word analysis, score breakdown, and PDF export functionality.

---

## 6. Verification & Health Summary

- **Vitest Test Suite**: `14 passed (14 test suites)`, `78 passed (78 tests)`
- **ESLint Code Quality**: `0 errors` across web and api workspaces
- **Production Build**: `dist/` compiled successfully in Vite (`2761 modules transformed`)
- **Security Check**: Secret keys (Firebase Service Accounts, `.env`) excluded via `.gitignore`
- **Documentation**: Complete index in `docs/README.md` and interview guides in `docs/interview-prep/`
