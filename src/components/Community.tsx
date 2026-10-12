/* eslint-disable @next/next/no-img-element */
import { preconnect } from "react-dom";
import { FaDiscord } from "react-icons/fa6";
import { formatNumber } from "@/lib/format";
import type { DiscordGuild } from "@/lib/discord";
import Reveal from "./Reveal";

export default function Community({ guild }: { guild: DiscordGuild | null }) {
  if (!guild) return null;
  preconnect("https://cdn.discordapp.com");

  return (
    <section aria-labelledby="community-title" className="mx-auto max-w-6xl px-6 py-12">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card/70 p-8 sm:p-10">
          {guild.banner && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${guild.banner})` }}
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-card/30"
          />
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-600/20 blur-[90px]"
          />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {guild.icon ? (
                <img
                  src={guild.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-border"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary text-2xl text-violet-300"
                >
                  <FaDiscord />
                </span>
              )}
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-widest text-violet-400">
                  Community
                </p>
                <h2
                  id="community-title"
                  translate="no"
                  className="mt-1 break-words text-2xl font-semibold text-white"
                >
                  {guild.name}
                </h2>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="tabular-nums">{formatNumber(guild.online)}</span> online
                  </span>
                  <span>
                    <span className="tabular-nums">{formatNumber(guild.members)}</span> members
                  </span>
                </p>
              </div>
            </div>

            <a
              href={guild.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              <FaDiscord aria-hidden="true" />
              Join the Server
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
