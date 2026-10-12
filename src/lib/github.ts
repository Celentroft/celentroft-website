import { profile } from "./config";

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
}

export interface LanguageShare {
  name: string;
  count: number;
  percent: number;
}

export interface GithubData {
  repos: Repo[];
  totalStars: number;
  followers: number;
  publicRepos: number;
  languages: LanguageShare[];
  lastPush: { repo: string; url: string; at: string } | null;
}

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

const opts = { headers, next: { revalidate: 3600 } };

const EMPTY: GithubData = {
  repos: [],
  totalStars: 0,
  followers: 0,
  publicRepos: 0,
  languages: [],
  lastPush: null,
};

function languageShares(repos: Repo[]): LanguageShare[] {
  const counts = new Map<string, number>();
  for (const { language } of repos) {
    if (language) counts.set(language, (counts.get(language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((n, c) => n + c, 0);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
    }));
}

export async function getGithubData(): Promise<GithubData> {
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${profile.github}/repos?per_page=100&sort=pushed`,
        opts,
      ),
      fetch(`https://api.github.com/users/${profile.github}`, opts),
    ]);
    if (!reposRes.ok) return EMPTY;

    const raw = (await reposRes.json()) as ApiRepo[];
    const user = userRes.ok
      ? ((await userRes.json()) as { followers: number; public_repos: number })
      : { followers: 0, public_repos: raw.length };

    const own = raw.filter((r) => !r.fork && !r.archived);
    const repos = own
      .filter((r) => r.name !== profile.github)
      .map<Repo>((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        topics: r.topics ?? [],
        pushedAt: r.pushed_at,
      }))
      .sort((a, b) => b.stars - a.stars || +new Date(b.pushedAt) - +new Date(a.pushedAt));

    // The API already returns repositories sorted by last push (desc).
    const latest = own[0];

    return {
      repos,
      totalStars: repos.reduce((n, r) => n + r.stars, 0),
      followers: user.followers,
      publicRepos: user.public_repos,
      languages: languageShares(repos),
      lastPush: latest
        ? { repo: latest.name, url: latest.html_url, at: latest.pushed_at }
        : null,
    };
  } catch {
    return EMPTY;
  }
}
