# Portfolio site setup — paste this into Claude Code

Copy the entire contents of this file and paste it into Claude Code as your first message. Claude should run this as a **phased operator runbook** for a modern portfolio-engine consumer (route registry, manifest, named overrides, and admin tools enabled by default).

---

You are helping me set up a new personal portfolio site from scratch using
`@portfolio-engine/editorial-theme` (published on npm, source at
https://github.com/rainonej/portfolio-engine).

Work through the phases below in order. Do not move to the next phase until
the current one is finished. At each phase, tell me clearly what you're doing
and what — if anything — you need from me or need me to do manually.

---

## Phase 1 — Learn about me

Before touching any files, ask me for everything you need in one grouped prompt:

- **Name** — as it should appear on the site
- **Role** — what I do
- **Tagline** — one short punchy line
- **Description** — one sentence: my work and who I do it for
- **Location** — city and country
- **Tone** — how I write
- **Audience** — who reads my site
- **Pages** — which of these I want: Work, Writing, About, Contact (default: all)
- **Booking URL** — optional scheduling link
- **Social URLs** — GitHub, LinkedIn, X/Twitter (optional)
- **Repo name** — what to call my GitHub repository

If any answer is vague, ask one follow-up before moving on.

---

## Phase 2 — Build the project

Using my answers, follow the technical setup guide at:
https://github.com/rainonej/portfolio-engine/blob/main/docs/downstream/new-site-setup.md

Do all of the following:

- Scaffold the Astro project and install `@portfolio-engine/editorial-theme`
- Install `@portfolio-engine/admin-tools` and Node adapter support as part of the default setup
- Create `src/config/site.json`, `navigation.json`, `theme.json`, `features.json`
- Create `src/content.config.ts` and placeholder content in `src/content/`
- Fill `src/context/site-owner.json` and `src/context/brand-voice.json`; keep `agent-rules.md` as an editable template
- Create `src/overrides/README.md`
- Wire at least one named override surface (Hero) so the overrides system is demonstrated
- Run a local build and confirm `.portfolio-engine/manifest.json` is generated

When done, summarize what was created and list files I should customize first.

---

## Phase 3 — Push to GitHub

1. Initialize a git repo if needed
2. Create a new GitHub repo using my chosen repo name (`gh repo create` if available)
3. Commit everything and push to `main`

Tell me the GitHub URL after push.

---

## Phase 4 — Vercel (manual, guided)

Give me exact click-by-click instructions.

For a standard standalone consumer repo, tell me:

> Go to vercel.com and log in. Click **Add New → Project** and import **[repo name]**.
> Set:
>
> - Root Directory: `.`
> - Install Command: `pnpm install`
> - Build Command: `pnpm build`
> - Output Directory: default
>
> Click **Deploy**. After it succeeds, go to **Settings → General** and set Node.js to **22.x**.
> Come back and paste the deployment URL.

Wait for my URL before moving on.

---

## Phase 5 — Wire up canonical URL + polish context

Once I provide the Vercel URL:

1. Update `src/config/site.json` `baseUrl`
2. Commit and push
3. Ask whether to replace placeholder project content now
4. Ask whether to replace placeholder writing now
5. Improve `src/context/brand-voice.json` by interviewing me briefly and writing concrete values

---

## Phase 6 — Production `SITE_URL` env var (manual, guided)

Tell me:

> In Vercel, open **Settings → Environment Variables**.
> Add:
>
> - Name: `SITE_URL`
> - Value: `[production URL from Phase 5]`
> - Environment: **Production only**
>
> Save, then go to **Deployments**, open the latest deployment menu, and click **Redeploy**.
> Come back when done.

---

## Phase 7 — Custom domain (ask first)

Ask: “Do you have a custom domain you want to use, like yourname.com?”

- **If yes:** guide domain setup in Vercel, then:
  1. update `site.json` `baseUrl`
  2. commit + push
  3. tell me to update Vercel `SITE_URL` and redeploy
- **If no:** continue.

---

## Phase 8 — Registry / manifest / admin verification

Run and report these checks:

- Build passes
- `.portfolio-engine/manifest.json` exists and lists route + override capabilities
- `/admin` is present and `/api/content` contract is wired
- Explain how route remaps/disables and named overrides are controlled in config/integration

---

## Wrap-up

Give me a short summary with:

- Live URL
- Repo URL
- The three folders I own most: `src/content/`, `src/config/`, `src/context/`
- Where to add overrides: `src/overrides/`
- One line for theme updates (`pnpm update @portfolio-engine/editorial-theme && pnpm build`)
