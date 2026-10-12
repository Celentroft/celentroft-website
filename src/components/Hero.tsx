import { FiArrowRight, FiGithub, FiStar } from "react-icons/fi";
import { profile, githubUrl } from "@/lib/config";
import { timeAgo } from "@/lib/format";
import type { GithubData } from "@/lib/github";
import CountUp from "./CountUp";
import HeroGrid from "./HeroGrid";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";
import Terminal from "./Terminal";

export default function Hero({
  github,
  discordUrl,
}: {
  github: GithubData;
  discordUrl?: string;
}) {
  const hasData = github.repos.length > 0;

  return (
    <section id="top" className="relative flex min-h-dvh items-center overflow-hidden">
      <HeroGrid />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[160px]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1 font-mono text-xs text-violet-300">
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              Open to Opportunities
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              <ScrambleText text={profile.name} />
              <span aria-hidden="true" className="text-violet-500">
                .
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              {profile.role} building Discord bots, automations and web applications that hold up
              in production — from community-scale tooling to clean, fast interfaces.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              View Projects
              <FiArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-violet-400/40 hover:text-white"
            >
              <FiGithub aria-hidden="true" />
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>

          {hasData && (
            <>
              {github.lastPush && (
                <Reveal delay={0.3}>
                  <a
                    href={github.lastPush.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-8 inline-flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted-foreground transition-colors hover:text-white"
                  >
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>last push</span>
                    <span translate="no" className="text-violet-300">
                      {github.lastPush.repo}
                    </span>
                    <span>· {timeAgo(github.lastPush.at)}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Reveal>
              )}

              <Reveal delay={0.36} className="mt-8 flex gap-8 text-sm">
                <div>
                  <p className="flex items-center gap-1.5 text-2xl font-semibold text-white">
                    <CountUp value={github.totalStars} />
                    <FiStar aria-hidden="true" className="text-base text-violet-400" />
                  </p>
                  <p className="text-muted-foreground">GitHub stars</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">
                    <CountUp value={github.publicRepos} />
                  </p>
                  <p className="text-muted-foreground">Repositories</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">
                    <CountUp value={github.followers} />
                  </p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
              </Reveal>
            </>
          )}
        </div>

        <Reveal delay={0.2} className="flex justify-center lg:justify-end">
          <Terminal
            repos={github.repos.map(({ name, url, stars, language }) => ({
              name,
              url,
              stars,
              language,
            }))}
            stats={{
              repos: github.publicRepos,
              stars: github.totalStars,
              followers: github.followers,
            }}
            profile={{
              name: profile.name,
              realName: profile.realName,
              role: profile.role,
              location: profile.location,
              email: profile.email,
              github: profile.github,
              discordUser: profile.discordUser,
            }}
            githubUrl={githubUrl}
            discordUrl={discordUrl}
          />
        </Reveal>
      </div>
    </section>
  );
}
