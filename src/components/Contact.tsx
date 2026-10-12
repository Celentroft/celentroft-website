import { FiGithub, FiMail, FiMapPin } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { profile, githubUrl } from "@/lib/config";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

const channels: {
  label: string;
  value: string;
  icon: IconType;
  href?: string;
}[] = [
  {
    label: "Email",
    value: profile.email,
    icon: FiMail,
    href: `mailto:${profile.email}`,
  },
  { label: "GitHub", value: `github.com/${profile.github}`, icon: FiGithub, href: githubUrl },
  { label: "Discord", value: profile.discordUser, icon: FaDiscord, href: profile.discordUserUrl },
  { label: "Location", value: profile.location, icon: FiMapPin },
];

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
          03 — Contact
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Let&apos;s work together.
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Have a project in mind or want to talk? My inbox is open.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {channels.map(({ label, value, icon: Icon, href }, i) => {
          const body = (
            <div className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-lg text-violet-300">
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="truncate text-sm font-medium text-zinc-100">
                  {value}
                </p>
              </div>
            </div>
          );
          return (
            <Reveal key={label} delay={i * 0.05}>
              {href ? (
                <SpotlightCard as="a" href={href}>
                  {body}
                </SpotlightCard>
              ) : (
                <SpotlightCard>{body}</SpotlightCard>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
