import type { IconType } from "react-icons";
import {
  SiPython,
  SiTypescript,
  SiJavascript,
  SiRust,
  SiGo,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiLinux,
  SiGit,
} from "react-icons/si";
import { profile } from "@/lib/config";
import GhostNumber from "./GhostNumber";
import { SplitT, T } from "./Lang";
import Reveal from "./Reveal";

const stack: { name: string; icon: IconType }[] = [
  { name: "Python", icon: SiPython },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Rust", icon: SiRust },
  { name: "Go", icon: SiGo },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React", icon: SiReact },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Docker", icon: SiDocker },
  { name: "Linux", icon: SiLinux },
  { name: "Git", icon: SiGit },
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <GhostNumber n="01" />
      <Reveal layer={1}>
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
          <T k="about.label" />
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          <SplitT k="about.title" />
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <Reveal layer={2} className="space-y-4 text-[1.05rem] leading-relaxed text-zinc-300">
          <p>
            <T k="about.p1" vars={{ name: profile.realName, location: profile.location }} />
          </p>
          <p>
            <T k="about.p2" />
          </p>
        </Reveal>

        <Reveal delay={0.1} layer={3}>
          <ul className="flex flex-wrap gap-2.5">
            {stack.map(({ name, icon: Icon }) => (
              <li
                key={name}
                translate="no"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-zinc-200 backdrop-blur transition-colors hover:border-violet-400/40 hover:text-white"
              >
                <Icon aria-hidden="true" className="text-violet-400" />
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
