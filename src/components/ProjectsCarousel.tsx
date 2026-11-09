"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FiArrowUpRight, FiGitBranch, FiStar } from "react-icons/fi";
import { T } from "./Lang";
import { useStage } from "./Stage";

export type CarouselItem = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  color: string;
  stars: number;
  forks: number;
  topics: string[];
};

/**
 * In the pinned stage the project cards sit on a 3D arc and scrolling rotates the arc
 * (the stage hands us a 0..1 progress). On phones it is a plain swipeable row.
 */
export default function ProjectsCarousel({ items }: { items: CarouselItem[] }) {
  const { active, register } = useStage();
  const track = useRef<HTMLUListElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const stageMode = active && items.length > 1;

  useEffect(() => {
    const trackEl = track.current;
    if (!stageMode || !trackEl) return;
    const cards = Array.from(trackEl.children) as HTMLElement[];
    const n = cards.length;

    const apply = (p: number) => {
      const center = p * (n - 1);
      const w = cards[0].offsetWidth;
      cards.forEach((card, i) => {
        const d = i - center;
        const ad = Math.abs(d);
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: d * w * 0.66,
          z: -Math.min(ad, 3) * 170,
          rotateY: -d * 28,
          scale: Math.max(1 - ad * 0.1, 0.6),
          opacity: Math.max(1 - ad * 0.4, 0),
          zIndex: Math.round(100 - ad * 10),
          pointerEvents: ad < 0.5 ? "auto" : "none",
        });
      });
      const idx = Math.min(n - 1, Math.max(0, Math.round(center)));
      if (counter.current) {
        counter.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      }
      if (title.current) title.current.textContent = cards[idx].dataset.name ?? "";
    };
    apply(0);
    const unregister = register("projects", { steps: n, apply });
    return () => {
      unregister();
      cards.forEach((card) => gsap.set(card, { clearProps: "all" }));
    };
  }, [stageMode, items, register]);

  return (
    <div
      className={`group relative ml-[calc(50%-50vw)] w-screen ${stageMode ? "is-stage" : ""}`}
    >
      <div className="relative group-[.is-stage]:h-[min(46vh,420px)] group-[.is-stage]:[perspective:1400px]">
        <ul
          ref={track}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] group-[.is-stage]:block group-[.is-stage]:overflow-visible group-[.is-stage]:p-0"
        >
          {items.map((repo) => (
            <li
              key={repo.name}
              data-name={repo.name}
              className="w-[82vw] max-w-[420px] shrink-0 snap-center group-[.is-stage]:absolute group-[.is-stage]:left-1/2 group-[.is-stage]:top-[46%] group-[.is-stage]:w-[min(560px,50vw)] group-[.is-stage]:max-w-none"
            >
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group/card flex h-full min-h-[260px] flex-col rounded-2xl border border-white/10 bg-[#0b0614]/90 p-6 shadow-2xl backdrop-blur-md transition-colors hover:border-violet-400/50 group-[.is-stage]:min-h-[min(300px,36vh)] group-[.is-stage]:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3
                    translate="no"
                    className="min-w-0 break-words font-mono text-lg font-semibold text-white group-[.is-stage]:text-xl"
                  >
                    {repo.name}
                  </h3>
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-lg text-muted-foreground transition-colors group-hover/card:text-violet-300"
                  />
                </div>
                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-zinc-400">
                  {repo.description ?? "—"}
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
                        style={{ background: repo.color }}
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
                  <span className="sr-only">
                    <T k="projects.all" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* index + title under the arc, only inside the stage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-14 left-1/2 hidden -translate-x-1/2 text-center group-[.is-stage]:block"
        >
          <span ref={counter} className="block font-mono text-xs text-violet-300" />
          <span
            ref={title}
            translate="no"
            className="mt-1 block text-3xl font-bold tracking-tight text-white"
          />
        </div>
      </div>
    </div>
  );
}
