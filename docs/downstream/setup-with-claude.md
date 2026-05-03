# Portfolio site setup — paste this into Claude Code

Copy the entire contents of this file and paste it into Claude Code as your first message. Claude will guide you through everything from there — asking for your details, building the site, and telling you exactly when to go click something in Vercel.

---

You are helping me set up a new personal portfolio site from scratch using
`@portfolio-engine/editorial-theme` (published on npm, source at
https://github.com/rainonej/portfolio-engine).

Work through the phases below in order. Do not move to the next phase until
the current one is finished. At each phase, tell me clearly what you're doing
and what — if anything — you need from me or need me to do manually.

---

## Phase 1 — Learn about me

Before touching any files, ask me for everything you need. Collect it all at
once rather than one question at a time:

- **Name** — as it should appear on the site
- **Role** — what I do (e.g. "product designer", "educator", "software engineer")
- **Tagline** — one short punchy line
- **Description** — one sentence: my work and who I do it for
- **Location** — city and country
- **Tone** — how I write (e.g. "warm and direct", "precise and minimal")
- **Audience** — who reads my site (e.g. "hiring managers at education nonprofits")
- **Pages** — which of these I want: Work, Writing, About, Contact (default: all four)
- **Repo name** — what to call my GitHub repository (e.g. "jordan-site")

If any answer is vague, ask one follow-up before moving on.

---

## Phase 2 — Build the project

Using my answers, follow the technical setup guide at:
https://github.com/rainonej/portfolio-engine/blob/main/docs/downstream/new-site-setup.md

Do all of the following:

- Scaffold the Astro project and install `@portfolio-engine/editorial-theme`
- Create `src/config/site.json`, `navigation.json`, `theme.json`, `features.json`
  with my real details
- Create `src/content.config.ts` and placeholder content in `src/content/`
  (I'll replace placeholders with real work later)
- Fill in `src/context/site-owner.json` and `src/context/brand-voice.json`
  from my Phase 1 answers; leave `agent-rules.md` as a template I can edit
- Create `src/overrides/README.md`

When done, tell me what was created and list any files I should come back and
edit myself.

---

## Phase 3 — Push to GitHub

1. Initialize a git repo here if one doesn't exist yet
2. Create a new GitHub repo called the name I gave in Phase 1 — use
   `gh repo create` if the GitHub CLI is available, otherwise walk me through
   creating it at github.com
3. Commit everything and push to `main`

Tell me the GitHub URL when it's pushed.

---

## Phase 4 — Vercel (you'll guide me through this manually)

You can't click buttons, so your job here is to give me exact instructions.
Tell me:

> Go to vercel.com and log in. Click **Add New → Project** and import your
> **[repo name]** repository. Set:
>
> - Root Directory: `.` (leave it as-is)
> - Build Command: `pnpm build`
> - Output Directory: leave as default
>
> Click **Deploy** and wait for it to go green. Then go to
> **Settings → General** and set Node.js to **22.x**. Come back here and
> paste the URL it gave you (it looks like `your-repo.vercel.app`).

Wait for me to come back with the URL before doing anything else.

---

## Phase 5 — Wire up the live URL

Once I give you the Vercel URL:

1. Update `src/config/site.json` `baseUrl` to that URL
2. Commit and push the change
3. Ask me: do I want to add my first real project now, or leave the placeholder?
4. Ask me: do I want to add my first real writing piece now, or leave the placeholder?
5. Walk me through filling in `src/context/brand-voice.json` properly — ask
   me questions and write it from my answers rather than leaving it generic

---

## Phase 6 — Production URL env var (you'll guide me)

Tell me:

> Go to your Vercel project → **Settings → Environment Variables**. Add a
> new variable:
>
> - Name: `SITE_URL`
> - Value: `[the URL from Phase 5]`
> - Environment: **Production** only (uncheck Preview and Development)
>
> Save it, then go to **Deployments**, open the latest deployment's menu
> (three dots), and click **Redeploy**. Come back when it's done.

---

## Phase 7 — Custom domain (ask me first)

Ask me: "Do you have a custom domain you want to use, like yourname.com?"

**If yes:** tell me to go to Vercel → **Settings → Domains** → add the
domain, and walk me through the DNS records I need to set. Once I confirm the
domain is live:

1. Update `src/config/site.json` `baseUrl` to the new domain
2. Commit and push
3. Tell me to go back to Vercel and update the `SITE_URL` env var to the new
   domain, then redeploy

**If no:** skip to the wrap-up.

---

## Wrap-up

Give me a short summary:

- Where the site is live
- The three folders that are mine to edit: `src/content/`, `src/config/`,
  `src/context/`
- One line on how to add new work later
- One line on how to update the theme when a new version is out
