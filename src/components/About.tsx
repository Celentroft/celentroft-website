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
    <section id="about" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
          01 — About
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Building things that last.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <Reveal className="space-y-4 leading-relaxed text-muted-foreground">
          <p>
            I&apos;m {profile.realName}, a software developer based in{" "}
            {profile.location}. I work across Python, TypeScript, Rust and Go,
            with a focus on reliable, well-structured software.
          </p>
          <p>
            Most of my recent work is Discord tooling — moderation, ticketing and
            automation systems used by large communities — which taught me a lot
            about performance, security and shipping things people actually
            depend on.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="flex flex-wrap gap-2.5">
            {stack.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-violet-400/40 hover:text-white"
              >
                <Icon className="text-violet-400" />
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
