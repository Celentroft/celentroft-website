/* eslint-disable @next/next/no-img-element */
import { FaDiscord } from "react-icons/fa6";
import type { DiscordGuild } from "@/lib/discord";
import Reveal from "./Reveal";

export default function Community({ guild }: { guild: DiscordGuild | null }) {
  if (!guild) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/70 p-8 sm:p-10">
          <div
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-[90px]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {guild.icon ? (
                <img
                  src={guild.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl border border-border"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary text-2xl text-violet-300">
                  <FaDiscord />
                </span>
              )}
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
                  Community
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {guild.name}
                </h2>
                <p className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {guild.online.toLocaleString("en-US")} online
                  </span>
                  <span>{guild.members.toLocaleString("en-US")} members</span>
                </p>
              </div>
            </div>

            <a
              href={guild.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              <FaDiscord />
              Join the server
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
