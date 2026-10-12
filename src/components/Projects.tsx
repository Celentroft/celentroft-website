import { FiArrowUpRight, FiGitBranch, FiStar } from "react-icons/fi";
import { githubUrl } from "@/lib/config";
import type { Repo } from "@/lib/github";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

const langColors: Record<string, string> = {
  Python: "#3776AB",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Rust: "#DEA584",
  Go: "#00ADD8",
  Java: "#B07219",
  HTML: "#E34C26",
  CSS: "#663399",
  Shell: "#89E051",
};

export default function Projects({ repos }: { repos: Repo[] }) {
  const shown = repos.slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
            02 — Projects
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Open source, live from GitHub.
          </h2>
        </div>
        <a
          href={`${githubUrl}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-violet-300 transition-colors hover:text-white"
        >
          All repositories <FiArrowUpRight />
        </a>
      </Reveal>

      {shown.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Repositories couldn&apos;t be loaded right now — find them directly on{" "}
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
                    <h3 className="font-mono text-base font-semibold text-white">
                      {repo.name}
                    </h3>
                    <FiArrowUpRight className="shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300" />
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {repo.description ?? "No description provided."}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-xs text-zinc-400">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            background: langColors[repo.language] ?? "#8b5cf6",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <FiStar className="text-violet-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiGitBranch className="text-violet-400" />
                      {repo.forks}
                    </span>
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
