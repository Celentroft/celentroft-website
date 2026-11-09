import { githubUrl, profile } from "@/lib/config";
import type { GithubData } from "@/lib/github";
import GhostNumber from "./GhostNumber";
import { SplitT, T } from "./Lang";
import Reveal from "./Reveal";
import Terminal from "./Terminal";

/** The interactive terminal, given its own beat in the scroll journey. */
export default function TerminalSection({
  github,
  discordUrl,
}: {
  github: GithubData;
  discordUrl?: string;
}) {
  return (
    <section
      id="terminal"
      aria-labelledby="terminal-title"
      className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center"
    >
      <GhostNumber n="02" className="!right-auto !left-0 !-top-6" />
      <Reveal layer={1}>
        <p className="font-mono text-xs uppercase tracking-widest text-violet-300">
          <T k="terminal.label" />
        </p>
        <h2
          id="terminal-title"
          className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl"
        >
          <SplitT k="terminal.title" />
        </h2>
        <p className="mt-3 text-zinc-300">
          <T k="terminal.hint" />
        </p>
      </Reveal>
      <Reveal layer={2} className="mt-8 flex w-full justify-center text-left">
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
    </section>
  );
}
