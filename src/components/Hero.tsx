import { FiArrowRight, FiGithub, FiStar } from "react-icons/fi";
import { profile, githubUrl } from "@/lib/config";
import { timeAgo } from "@/lib/format";
import type { GithubData } from "@/lib/github";
import CountUp from "./CountUp";
import { T } from "./Lang";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";

export default function Hero({ github }: { github: GithubData; discordUrl?: string }) {
  const hasData = github.repos.length > 0;

  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-28 text-center"
    >
      <div className="relative w-full max-w-[100vw]">
        <Reveal layer={1}>
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3.5 py-1 font-mono text-xs text-violet-300 backdrop-blur">
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            <T k="hero.status" />
          </p>
        </Reveal>

          <Reveal delay={0.08} layer={2}>
            <h1
              translate="no"
              className="text-[clamp(2.6rem,14.5vw,14rem)] font-bold uppercase leading-[0.9] tracking-tighter text-white [text-shadow:0_0_80px_rgb(139_92_246/0.35)]"
            >
              <ScrambleText text={profile.name} />
            </h1>
          </Reveal>

        <Reveal delay={0.16} layer={3}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8">
            <T k="hero.lead" vars={{ role: profile.role }} />
          </p>
        </Reveal>

        <Reveal delay={0.24} layer={4} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            <T k="hero.cta1" />
            <FiArrowRight
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-6 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur transition-colors hover:border-violet-400/50 hover:text-white"
          >
            <FiGithub aria-hidden="true" />
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>

        {hasData && (
          <>
            {github.lastPush && (
              <Reveal delay={0.3} layer={5}>
                <a
                  href={github.lastPush.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-8 inline-flex flex-wrap items-center justify-center gap-x-2 font-mono text-xs text-zinc-300 transition-colors hover:text-white"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>
                    <T k="hero.lastPush" />
                  </span>
                  <span translate="no" className="text-violet-300">
                    {github.lastPush.repo}
                  </span>
                  <span>· {timeAgo(github.lastPush.at)}</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Reveal>
            )}

            <Reveal delay={0.36} layer={5} className="mt-8 flex justify-center gap-10 text-sm">
              <div>
                <p className="flex items-center justify-center gap-1.5 text-2xl font-semibold text-white">
                  <CountUp value={github.totalStars} />
                  <FiStar aria-hidden="true" className="text-base text-violet-400" />
                </p>
                <p className="text-zinc-300">
                  <T k="hero.stars" />
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">
                  <CountUp value={github.publicRepos} />
                </p>
                <p className="text-zinc-300">
                  <T k="hero.repos" />
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">
                  <CountUp value={github.followers} />
                </p>
                <p className="text-zinc-300">
                  <T k="hero.followers" />
                </p>
              </div>
            </Reveal>
          </>
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-zinc-400"
      >
        <T k="hero.scroll" />
        <span className="h-10 w-px bg-gradient-to-b from-violet-400 to-transparent motion-safe:animate-pulse" />
      </div>
    </section>
  );
}
