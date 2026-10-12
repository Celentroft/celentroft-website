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

export interface GithubData {
  repos: Repo[];
  totalStars: number;
  followers: number;
  publicRepos: number;
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

export async function getGithubData(): Promise<GithubData> {
  const empty: GithubData = { repos: [], totalStars: 0, followers: 0, publicRepos: 0 };
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${profile.github}/repos?per_page=100&sort=pushed`,
        opts,
      ),
      fetch(`https://api.github.com/users/${profile.github}`, opts),
    ]);
    if (!reposRes.ok) return empty;

    const raw = (await reposRes.json()) as ApiRepo[];
    const user = userRes.ok
      ? ((await userRes.json()) as { followers: number; public_repos: number })
      : { followers: 0, public_repos: raw.length };

    const repos = raw
      .filter((r) => !r.fork && !r.archived && r.name !== profile.github)
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

    return {
      repos,
      totalStars: repos.reduce((n, r) => n + r.stars, 0),
      followers: user.followers,
      publicRepos: user.public_repos,
    };
  } catch {
    return empty;
  }
}
