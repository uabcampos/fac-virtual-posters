# AGENT INSTRUCTION FILE
# Project: Forge AHEAD Virtual Poster Session
# Goal: Build a production-ready, UX-first web app that hosts asynchronous poster sessions with structured discussion.
# Tone: Plain language. Encouraging. No academic jargon.
# Writing rule: Do not use em dashes anywhere in UI copy, documentation, comments, or strings.

################################################################################
## 0) NON-NEGOTIABLE OUTCOMES
################################################################################
1) This is NOT a PDF dump. It must feel like a real poster session:
   - fast browsing
   - clear “5-minute” understanding
   - easy, structured conversation
2) UX is the product. Optimize for:
   - low friction browsing
   - mobile-first viewing
   - clear calls to action
   - inclusive participation for community audiences
3) Posters must be easy to view without downloading.
4) Conversation must be structured into three types:
   - Question
   - Idea or connection
   - Feedback or encouragement
5) Frontend MUST NOT talk to the database directly.
6) All write operations must go through a server-side API with validation and authorization.
7) Admin tools can be protected behind login. Viewers do not need accounts.

################################################################################
## 1) SCOPE
################################################################################
Build an MVP that includes:
- Poster Gallery page (browse, search, filter, sort)
- Poster Detail page (poster view + 5-minute summary + conversation panel)
- Scholar submission flow (form + upload + draft state)
- Admin review and publish workflow
- Commenting with threaded replies
- Basic moderation (hide comment)
- Basic analytics (views, comments)

Nice-to-have if time permits:
- Email notifications (admin and scholar)
- “New activity since last visit” indicator
- Pinned scholar prompt at top of conversation
- Session landing page
- Export CSV for engagement

################################################################################
## 2) RECOMMENDED STACK
################################################################################
Use Next.js (App Router) + TypeScript + Tailwind.

Data:
- Postgres via Prisma (recommended) OR Supabase, but still via server routes only.

Storage:
- S3 compatible (recommended) OR Supabase Storage.
- Store posters as high-res image (required).
- Accept PDF upload, but always generate a poster image preview for viewing.

Auth:
- Admin-only auth (NextAuth or Supabase Auth).
- Optional scholar accounts. Prefer “magic link” later. For MVP, admin can create posters or approve submissions without scholar login.

Hosting:
- Vercel (recommended) with Postgres (Neon/Supabase) and S3 (R2/S3).

################################################################################
## 3) INFORMATION ARCHITECTURE
################################################################################
Routes (must implement):
- /sessions/[sessionSlug]
- /sessions/[sessionSlug]/posters
- /sessions/[sessionSlug]/posters/[posterSlug]
- /submit (submission form, session selection)
- /admin (dashboard)
- /admin/sessions
- /admin/sessions/[sessionId]
- /admin/posters/[posterId]

API routes (server-side only):
- GET  /api/sessions
- GET  /api/sessions/:sessionId
- GET  /api/posters?sessionId=&q=&tag=&sort=
- GET  /api/posters/:posterId
- POST /api/posters (create submission)
- PATCH /api/posters/:posterId (admin update, publish, reject)
- POST /api/posters/:posterId/view (increment unique view)
- GET  /api/posters/:posterId/comments
- POST /api/posters/:posterId/comments (create comment)
- POST /api/comments/:commentId/replies
- PATCH /api/comments/:commentId/hide (admin only)

################################################################################
## 4) UX REQUIREMENTS
################################################################################
4.1 Poster Gallery
- Card grid. Desktop 3–4 columns. Mobile 1 column.
- Each card must show:
  - poster thumbnail
  - title
  - scholar name(s)
  - institution(s)
  - one-liner “Why this matters”
  - tags
  - engagement indicator (comment count)
- Filters:
  - search box (title, scholar, institution, tags)
  - tag filter (multi-select)
  - sort: Recently active, Most commented, A–Z
- Clicking a card opens the Poster Detail page.

4.2 Poster Detail Page (most important)
- Two-column layout on desktop:
  - Left: poster + summary sections
  - Right: conversation and scholar panel (sticky)
- Single column on mobile with conversation below summary.

Header area must include:
- Back to Gallery
- Next/Previous poster within session
- Poster title
- Scholar name(s), institution(s)

Poster viewer must include:
- Zoom in/out
- Fullscreen
- Download button text must be “Take this with you”
- Poster must be an image viewer, not embedded PDF scrolling by default

5-minute summary must be visible without scrolling past multiple screens.
Structured fields (required):
- What problem does this address?
- Who does it matter to?
- What did you do?
- What did you find?
- What could this change?

Scholar presence panel must include:
- Scholar photo (optional, but supported)
- Name
- Contact (email optional, toggle per poster)
- Welcome message (1–2 sentences)
Optional media:
- intro video or audio (1–2 min)
Optional pinned prompt:
- “What I’d love feedback on”

Conversation must be structured:
- Tabs or segmented controls:
  - Questions
  - Ideas
  - Feedback
- Primary action buttons:
  - Ask a question
  - Share an idea or connection
  - Leave feedback or encouragement
- Threaded replies
- Scholar replies visually distinct (badge “Scholar”)
- Anonymous option for commenters (toggle)
- Display community-friendly guidance text:
  - “Be respectful. Share questions and ideas that can help move the work forward.”

4.3 Submission
- Public submission page (no login required for MVP).
- Required fields:
  - session selection
  - poster title
  - scholar names
  - institutions
  - poster file upload (image required; PDF allowed but must produce image preview)
  - tags
  - why-this-matters one-liner
  - all 5-minute summary fields
- Optional:
  - welcome message
  - intro media
  - contact email visibility toggle
  - feedback prompt
- After submission:
  - show success message
  - submission is “Pending review”

4.4 Admin
- Admin dashboard:
  - Sessions list, create session, open/close session
  - Posters list by session with status filters
  - Poster review view (preview, metadata, approve/publish, request changes, reject)
  - Comment moderation (hide/unhide)
- Basic analytics:
  - views, comments, response rate by poster
  - most active posters

################################################################################
## 5) DATA MODEL
################################################################################
Use these entities and fields.

Session
- id (uuid)
- slug (unique)
- name
- startAt
- endAt
- status: draft | live | archived
- createdAt
- updatedAt

Poster
- id (uuid)
- sessionId (fk)
- slug (unique within session)
- title
- scholarNames (string array)
- institutions (string array)
- tags (string array)
- whyThisMatters (string)
- posterImageUrl (string)
- posterPdfUrl (string, nullable)
- posterImageWidth (int, nullable)
- posterImageHeight (int, nullable)
- summaryProblem (text)
- summaryAudience (text)
- summaryMethods (text)
- summaryFindings (text)
- summaryChange (text)
- welcomeMessage (text, nullable)
- feedbackPrompt (text, nullable)
- scholarPhotoUrl (string, nullable)
- contactEmail (string, nullable)
- showContactEmail (boolean, default false)
- introMediaUrl (string, nullable)
- introMediaType: none | video | audio
- status: draft | pending | published | rejected
- publishedAt (datetime, nullable)
- createdAt
- updatedAt

Comment
- id (uuid)
- posterId (fk)
- type: question | idea | feedback
- authorName (string, nullable if anonymous)
- authorRole (string, nullable)
- isAnonymous (boolean)
- content (text)
- parentId (uuid, nullable)  # for replies
- isHidden (boolean, default false)
- createdAt
- updatedAt

PosterView
- id (uuid)
- posterId (fk)
- viewerHash (string)  # hashed ip+ua+day or cookie id
- createdAt

################################################################################
## 6) SECURITY AND VALIDATION
################################################################################
- No DB calls from client.
- All POST/PATCH routes validate inputs with Zod.
- Rate limit comment creation (per ip, per poster).
- Sanitize comment content (prevent XSS).
- Admin routes require auth.
- Submission endpoint should include spam protection:
  - honeypot field
  - basic rate limiting
  - optional Turnstile later

################################################################################
## 7) PERFORMANCE REQUIREMENTS
################################################################################
- Poster images can be large. Use:
  - responsive image sizes
  - lazy loading in gallery
  - image viewer on detail that loads quickly
- Use pagination or infinite scroll for gallery if many posters.
- Cache GET endpoints where safe.

################################################################################
## 8) DESIGN SYSTEM
################################################################################
- Keep it clean and credible.
- Use soft neutral background, card-based layout, clear typographic hierarchy.
- Sticky right column for conversation on desktop.
- Buttons must be large enough for mobile.
- Avoid clutter. White space is a feature.

Copy rules:
- Plain language.
- Encourage participation.
- No em dashes.
- Avoid jargon like “explanatory sequential design” in UI copy. That content can live in the poster, not the UI.

################################################################################
## 9) ACCEPTANCE CRITERIA (MVP)
################################################################################
A) Viewer can:
- open session posters
- browse, filter, search, sort
- open poster
- zoom and fullscreen
- read 5-minute summary
- post comment in each type
- reply in thread

B) Scholar can:
- submit poster without logging in
- see confirmation
- later see their poster published and respond to comments (for MVP, allow responding via public form if poster has a unique “scholar token” link OR allow admin to respond on their behalf; choose simplest secure option)

C) Admin can:
- create session
- review submissions
- publish posters
- hide comments
- view basic analytics

################################################################################
## 10) IMPLEMENTATION PLAN (DO THIS IN ORDER)
################################################################################
Phase 1: Foundations
- Set up Next.js + Tailwind + Prisma
- Create DB schema and migrations
- Build seed data utilities

Phase 2: Public Experience
- Poster Gallery UI + API
- Poster Detail UI + API
- Poster image viewer (zoom, pan, fullscreen)
- Conversation UI (tabs, create comment, reply)

Phase 3: Submission + Admin
- Submission form + upload pipeline
- Poster status workflow: pending -> published
- Admin dashboard for review, publish, reject
- Comment moderation

Phase 4: Polish
- Engagement indicators
- Recently active sorting
- Empty states and helpful microcopy
- Mobile QA
- Accessibility pass

################################################################################
## 11) POSTER EXAMPLE REFERENCE
################################################################################
Use the uploaded example poster as a realistic test case:
- The system must display a poster with multiple boxes and small text clearly when zoomed.
- Ensure the image viewer remains smooth and readable.
Reference file: Allen Watts.pdf (page 1). Use it only as a content example. Do not hardcode its text into UI.
Source:  [oai_citation:0‡Allen Watts.pdf](sediment://file_00000000581471f590df106c24c8bc1a)

################################################################################
## 12) DELIVERABLES
################################################################################
- Working app with the routes listed above
- Database schema and migrations
- Clear README with:
  - local setup
  - env vars
  - deployment steps
- Seed script that creates:
  - 1 live session
  - 10 sample posters
  - sample comments across all types

################################################################################
## 13) FINAL GUIDANCE
################################################################################
If tradeoffs are required:
- Choose clarity over complexity.
- Choose mobile usability over fancy features.
- Choose structured conversation over generic comments.
- Choose server-side validation and authorization every time.