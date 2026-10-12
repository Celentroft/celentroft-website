"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ShortcutKey from "./ShortcutKey";

/** 404 page dressed as a failed shell command. */
export default function NotFoundTerminal() {
  const pathname = usePathname();

  return (
    <main
      id="main"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16"
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[150px]"
      />

      <div
        translate="no"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card/80 shadow-[0_0_80px_-20px_rgba(139,92,246,.45)] backdrop-blur"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">
            celentroft@portfolio: ~
          </span>
        </div>

        <div className="space-y-1.5 p-6 font-mono text-[13px] leading-6">
          <p className="break-all text-zinc-100">
            <span aria-hidden="true" className="mr-2 text-violet-500">
              $
            </span>
            cd {pathname}
          </p>
          <p className="break-all text-violet-300/90">
            cd: {pathname}: no such file or directory
          </p>
          <h1 className="pt-4 font-sans text-4xl font-semibold tracking-tight text-white">
            404<span className="text-violet-500">.</span>
          </h1>
          <p className="text-zinc-400 [font-family:var(--font-geist-sans)] text-sm">
            This page doesn&rsquo;t exist, or it moved somewhere you can&rsquo;t cd into.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-4 [font-family:var(--font-geist-sans)]">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              Return Home
            </Link>
            <span className="text-xs text-muted-foreground">
              or press <ShortcutKey className="font-mono text-violet-400" /> on the homepage
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
