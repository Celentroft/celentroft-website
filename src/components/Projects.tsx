import { FiArrowUpRight } from "react-icons/fi";
import { githubUrl } from "@/lib/config";
import type { LanguageShare, Repo } from "@/lib/github";
import GhostNumber from "./GhostNumber";
import { SplitT, T } from "./Lang";
import ProjectsCarousel from "./ProjectsCarousel";
import Reveal from "./Reveal";

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
    <Reveal delay={0.05} layer={2} className="mt-8">
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
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <GhostNumber n="03" className="!-top-16" />
      <Reveal layer={1} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
            <T k="projects.label" />
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            <SplitT k="projects.title" />
          </h2>
        </div>
        <a
          href={`${githubUrl}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-violet-300 transition-colors hover:text-white"
        >
          <T k="projects.all" /> <FiArrowUpRight aria-hidden="true" />
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
        <div className="mt-10" data-layer="3">
          <ProjectsCarousel
            items={shown.map((repo) => ({
              name: repo.name,
              url: repo.url,
              description: repo.description,
              language: repo.language,
              color: repo.language ? colorOf(repo.language) : "#8b5cf6",
              stars: repo.stars,
              forks: repo.forks,
              topics: repo.topics,
            }))}
          />
        </div>
      )}
    </section>
  );
}
