## Forge AHEAD Virtual Poster Sessions

This is the codebase for the Forge AHEAD Center virtual poster gallery. It is a **Next.js App Router** application with:

- TypeScript + Tailwind
- Prisma + Postgres (Neon on Netlify)
- Static audio guides, interactive poster viewer, and structured conversations

The goal is to provide a **fast, inclusive virtual poster experience** (no PDFs-only) with:

- Poster gallery and “hall” view
- 5‑minute summaries
- Structured comments (questions, ideas, feedback)
- Light analytics and engagement indicators

---

## Local setup

**Requirements**

- Node 20+
- A Postgres database (Neon, Supabase, or local)

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

Create a `.env` file at the project root:

```bash
DATABASE_URL="postgresql://user:password@host:port/db?sslmode=require"
GEMINI_API_KEY="optional-google-tts-key"
ADMIN_SECRET="set-a-long-random-string"
```

**3. Database workflow (important)**

We use **Prisma Migrate** as the source of truth.

- To sync schema and run migrations locally:

```bash
npx prisma migrate dev
npx prisma db seed
```

- Do **not** run `prisma db push` against production. That bypasses migrations.

**4. Run the dev server**

```bash
npm run dev
```

Then open `http://localhost:3000`.

---

## Deployment (Netlify + Neon)

Netlify is configured via `netlify.toml` to:

```toml
[build]
  command = "npx prisma generate && npx prisma migrate deploy && npm run build"
  publish = ".next"
```

Environment variables required on Netlify:

- `DATABASE_URL` – Neon connection string
- `GEMINI_API_KEY` – for optional audio generation
- `ADMIN_SECRET` – shared secret for the simple admin gate

On each deploy, Netlify will:

1. Generate the Prisma client
2. Apply any pending migrations to the Neon database
3. Build the Next.js app

---

## Key routes

- `/` – Landing page
- `/sessions/[sessionSlug]/posters` – Poster gallery
- `/sessions/[sessionSlug]/hall` – Spatial “poster hall”
- `/sessions/[sessionSlug]/posters/[posterSlug]` – Poster detail
- `/submit` – Public submission form
- `/admin` – Admin dashboard (protected)

API routes (all server‑side):

- `/api/posters` – Gallery API (filters, sort)
- `/api/posters/submit` – Create submission
- `/api/posters/[posterId]/comments` – Comments + replies
- `/api/posters/[posterId]/view` – View tracking
- `/api/posters/[posterId]/bookmark` – Bookmark toggle
- `/api/posters/[posterId]/upvote` – Upvote
- `/api/me/bookmarks` – Current visitor’s bookmarks for a session
- `/api/admin/*` – Admin moderation (requires `ADMIN_SECRET` gate)

---

## Development notes

- **No direct DB access from the client.** All writes go through server routes with Zod validation.
- **Images first.** Posters are rendered as images (with zoom and fullscreen), even if the source was a PDF.
- **Copy style.** Plain language, no em‑dashes, avoid heavy jargon in UI strings.

If you’re unsure about anything, check `build-instructions.md` for the original product spec and acceptance criteria.
