# Setting up your portfolio site with Claude

A step-by-step runbook. Open this file alongside Claude Code and paste each prompt when you reach that step. Steps 3, 5, and 6 are short Vercel dashboard tasks you do yourself — no Claude needed.

---

## Before you start

You need these four things installed and accounts created:

|                    |                                                 |
| ------------------ | ----------------------------------------------- |
| **Node.js 22**     | [nodejs.org](https://nodejs.org)                |
| **pnpm**           | Run `npm install -g pnpm` after installing Node |
| **GitHub account** | [github.com](https://github.com)                |
| **Vercel account** | [vercel.com](https://vercel.com)                |
| **Claude Code**    | [claude.ai/code](https://claude.ai/code)        |

Create a new empty folder on your computer. Open it in Claude Code. You're ready.

---

## Step 1 — Scaffold your site

Fill in your details and paste this into Claude Code:

```
I'm setting up a new personal portfolio site using @portfolio-engine/editorial-theme from npm.
Read the full setup guide at:
https://github.com/rainonej/portfolio-engine/blob/main/docs/downstream/new-site-setup.md

My details:
  Name:        [YOUR FULL NAME]
  Role:        [WHAT YOU DO — e.g. "product designer", "educator", "software engineer"]
  Tagline:     [SHORT PUNCHY LINE — e.g. "designs for clarity"]
  Description: [ONE SENTENCE — your work and who you do it for]
  Location:    [CITY, COUNTRY]
  Tone:        [HOW YOU WRITE — e.g. "warm and direct", "precise and minimal"]
  Audience:    [WHO READS YOUR SITE — e.g. "hiring managers in education nonprofits"]
  Pages I want: Work / Writing / About / Contact (remove any you don't need)

Create placeholder entries in src/content/ that I can swap out for real work later.
Fill in src/context/ using my details above.
When you're done, list exactly which files I still need to edit myself.
```

Claude will scaffold the full project structure, install dependencies, and tell you what's left for you to fill in.

---

## Step 2 — Push to GitHub

Once the scaffold is done, paste this:

```
Please push this project to GitHub.
  1. Run git init if there's no repo here yet.
  2. Create a new GitHub repo called [YOUR-REPO-NAME] — use the GitHub CLI (gh repo create)
     if it's available, otherwise walk me through creating it manually.
  3. Commit everything and push to main.
```

---

## Step 3 — Connect to Vercel _(manual — ~2 minutes)_

Do this yourself in the Vercel dashboard:

1. **Add New → Project** → import your GitHub repo
2. **Root Directory:** leave as `.`
3. **Build Command:** `pnpm build`
4. **Node.js:** set to **22.x** (Settings → General)
5. Click **Deploy** and wait for it to go green

Note the URL Vercel gives you (e.g. `your-repo.vercel.app`). You'll use it in the next step.

---

## Step 4 — Make it real

Once the site is live, paste this:

```
My site is live at [https://your-site.vercel.app].

Please:
  1. Update src/config/site.json baseUrl to that URL.
  2. Help me add my first real project to src/content/projects/.
  3. Help me add my first real writing piece to src/content/writing/.
  4. Ask me the questions needed to fill in src/context/brand-voice.json
     with my actual tone, audience, and what language I want to avoid.
```

---

## Step 5 — Set your production URL in Vercel _(manual)_

In Vercel: **Project → Settings → Environment Variables**, add:

- **Name:** `SITE_URL`
- **Value:** your production URL (e.g. `https://your-repo.vercel.app` or your custom domain)
- **Environment:** Production only

Trigger a redeploy after saving.

---

## Step 6 — Add a custom domain _(optional, manual)_

In Vercel: **Project → Settings → Domains** → add your domain, follow the DNS instructions.

Once the domain is live, come back and paste this:

```
My custom domain is now live at [https://yourname.com].

Please:
  1. Update src/config/site.json baseUrl to the new domain.
  2. Remind me to update the SITE_URL env var in Vercel to match.
```

Then in Vercel update `SITE_URL` to the new domain and redeploy.

---

## Adding content later

Any time you want to add new work, writing, or update your profile, open Claude Code in your site folder and paste:

```
I want to add [a new project / a new blog post / update my about page].
Here are the details: [describe what you want]

Please create the right file in src/content/ and make sure the frontmatter is correct.
```

---

## Keeping the theme up to date

```
Please update @portfolio-engine/editorial-theme to the latest version,
check the changelog for any breaking changes, and make sure the build still passes.
```
