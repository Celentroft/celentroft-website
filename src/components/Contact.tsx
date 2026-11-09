import { FiGithub, FiMail, FiMapPin } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa6";
import { profile, githubUrl } from "@/lib/config";
import CopyButton from "./CopyButton";
import GhostNumber from "./GhostNumber";
import { SplitT, T } from "./Lang";
import LocalTime from "./LocalTime";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-lg text-violet-300"
    >
      {children}
    </span>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-wider text-muted-foreground">{children}</p>;
}

export default function Contact() {
  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
      <GhostNumber n="04" />
      <Reveal layer={1}>
        <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
          <T k="contact.label" />
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
          <SplitT k="contact.title" />
        </h2>
        <p className="mt-3 max-w-xl text-zinc-300">
          <T k="contact.lead" />
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {/* Email: the whole card is a mailto link (stretched), with a separate copy button. */}
        <Reveal layer={2}>
          <SpotlightCard>
            <div className="flex items-center gap-4 p-5">
              <IconBadge>
                <FiMail />
              </IconBadge>
              <div className="min-w-0 flex-1">
                <Label>Email</Label>
                <a
                  href={`mailto:${profile.email}`}
                  translate="no"
                  className="block break-all text-sm font-medium text-zinc-100 after:absolute after:inset-0 after:content-['']"
                >
                  {profile.email}
                </a>
              </div>
              <CopyButton value={profile.email} label="email address" />
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.05} layer={2}>
          <SpotlightCard as="a" href={githubUrl}>
            <div className="flex items-center gap-4 p-5">
              <IconBadge>
                <FiGithub />
              </IconBadge>
              <div className="min-w-0">
                <Label>GitHub</Label>
                <p translate="no" className="break-all text-sm font-medium text-zinc-100">
                  github.com/{profile.github}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.1} layer={3}>
          <SpotlightCard as="a" href={profile.discordUserUrl}>
            <div className="flex items-center gap-4 p-5">
              <IconBadge>
                <FaDiscord />
              </IconBadge>
              <div className="min-w-0">
                <Label>Discord</Label>
                <p translate="no" className="break-all text-sm font-medium text-zinc-100">
                  {profile.discordUser}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.15} layer={3}>
          <SpotlightCard>
            <div className="flex items-center gap-4 p-5">
              <IconBadge>
                <FiMapPin />
              </IconBadge>
              <div className="min-w-0">
                <Label>
                  <T k="contact.location" />
                </Label>
                <p className="text-sm font-medium text-zinc-100">{profile.location}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  <LocalTime timeZone={profile.timezone} />
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}
