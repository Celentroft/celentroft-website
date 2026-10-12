# Celentroft — Portfolio

Personal portfolio of **Celentroft (Nathan)**, software developer. A sober, deep black-and-violet site where the content is alive: projects, stats and community data are pulled live from GitHub and Discord.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS v4** and **Framer Motion**.

## Highlights

- **Live GitHub data** — repositories, stars, forks, topics, language breakdown and last push, fetched server-side and revalidated (no client-side API calls).
- **Discord community card** — server name, icon, banner and online/member counts from a public invite.
- **Interactive terminal** in the hero — `help`, `projects`, `open <repo>`, `contact`, `neofetch`, tab completion, command history… and a few hidden commands.
- **Command palette** (`Ctrl`/`⌘` + `K`) to jump to a section, open a repository, copy the email address…
- **Details** — cursor-reactive grid, spotlight cards, scroll progress, live local-time clock with the offset from the visitor's time zone, animated stats, a dynamic Open Graph image, a terminal-style 404 and some easter eggs for the curious.
- **Accessible by default** — skip link, visible focus rings, labelled controls, `prefers-reduced-motion` honoured everywhere, screen-reader friendly terminal and palette.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Configuration

Everything personal lives in [`src/lib/config.ts`](src/lib/config.ts): name, role, location, time zone, email, GitHub username and the Discord invite code (`discordInvite`, the part after `discord.gg/`; leave it empty to hide the community card).

Optional environment variable:

| Variable       | Purpose                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | Raises the GitHub API rate limit (60 → 5,000 requests/hour). A token with **no scopes** is enough — the data is public. Recommended on shared hosts such as Vercel. |

If GitHub or Discord is unreachable, the page still renders and the affected blocks degrade gracefully.

## Project structure

```
src/
├── app/            layout, page, 404, dynamic Open Graph image, global styles
├── components/     sections (Hero, About, Projects, Community, Contact…) and UI pieces
└── lib/            site config, GitHub / Discord data fetching, formatting helpers
```

## Deployment

Deployed on [Vercel](https://vercel.com). Every push to `main` triggers a new deployment; GitHub data is revalidated hourly and Discord data every ten minutes.
