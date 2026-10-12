import { FiArrowUpRight, FiGitBranch, FiStar } from "react-icons/fi";
import { githubUrl } from "@/lib/config";
import { isWithinYear, timeAgo } from "@/lib/format";
import type { LanguageShare, Repo } from "@/lib/github";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

const langColors: Record<string, string> = {
  Python: "#8b5cf6",
  TypeScript: "#3b82f6",
  JavaScript: "#facc15",
  Rust: "#fb923c",
  Go: "#22d3ee",
  Java: "#f87171",
  HTML: "#fb7185",
  CSS: "#e879f9",
  Shell: "#86efac",
};
const colorOf = (language: string) => langColors[language] ?? "#8b5cf6";

function LanguageBar({ languages }: { languages: LanguageShare[] }) {
  if (languages.length === 0) return null;
  const summary = languages.map((l) => `${l.name} ${l.percent}%`).join(", ");
  return (
    <Reveal delay={0.05} className="mt-8">
      <div
        role="img"
        aria-label={`Languages across repositories: ${summary}`}
        className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {languages.map((l) => (
          <span
            key={l.name}
            style={{ width: `${l.percent}%`, background: colorOf(l.name) }}
            className="h-full first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        {languages.map((l) => (
          <li key={l.name} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ background: colorOf(l.name) }}
            />
            <span translate="no">{l.name}</span>
            <span className="tabular-nums text-zinc-500">{l.percent}%</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function Projects({
  repos,
  languages,
}: {
  repos: Repo[];
  languages: LanguageShare[];
}) {
  const shown = repos.slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
            02 — Projects
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Open Source, Live from GitHub
          </h2>
        </div>
        <a
          href={`${githubUrl}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-violet-300 transition-colors hover:text-white"
        >
          All Repositories <FiArrowUpRight aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Reveal>

      <LanguageBar languages={languages} />

      {shown.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Repositories couldn&rsquo;t be loaded right now — find them directly on{" "}
          <a className="text-violet-300 underline" href={githubUrl}>
            GitHub
          </a>
          .
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((repo, i) => (
            <Reveal key={repo.name} delay={i * 0.05} className="h-full">
              <SpotlightCard as="a" href={repo.url} className="h-full">
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      translate="no"
                      className="min-w-0 break-words font-mono text-base font-semibold text-white"
                    >
                      {repo.name}
                    </h3>
                    <FiArrowUpRight
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-muted-foreground transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
                    />
                  </div>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {repo.description ?? "No description provided."}
                  </p>
                  {repo.topics.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <li
                          key={topic}
                          translate="no"
                          className="rounded-md bg-violet-500/10 px-2 py-0.5 font-mono text-[11px] text-violet-300"
                        >
                          {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: colorOf(repo.language) }}
                        />
                        <span translate="no">{repo.language}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 tabular-nums">
                      <FiStar aria-hidden="true" className="text-violet-400" />
                      {repo.stars}
                      <span className="sr-only"> stars</span>
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <FiGitBranch aria-hidden="true" className="text-violet-400" />
                      {repo.forks}
                      <span className="sr-only"> forks</span>
                    </span>
                    {/* repos untouched for over a year do not advertise their last update */}
                    {isWithinYear(repo.pushedAt) && (
                      <span className="ml-auto text-zinc-500">Updated {timeAgo(repo.pushedAt)}</span>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
