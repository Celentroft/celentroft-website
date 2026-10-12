"use client";

import { useEffect, useState } from "react";

interface Line {
  prompt?: boolean;
  text: string;
}

export default function Terminal({ repoCount }: { repoCount: number }) {
  const lines: Line[] = [
    { prompt: true, text: "whoami" },
    { text: "celentroft — software developer" },
    { prompt: true, text: "cat stack.txt" },
    { text: "python · typescript · rust · go" },
    { prompt: true, text: "ls projects/ | wc -l" },
    { text: `${repoCount} public repositories` },
    { prompt: true, text: "echo $STATUS" },
    { text: "open to opportunities" },
  ];
  const total = lines.reduce((n, l) => n + l.text.length + 1, 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const step = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? total
      : 1;
    const id = setInterval(() => {
      setTyped((t) => {
        if (t >= total) {
          clearInterval(id);
          return t;
        }
        return Math.min(t + step, total);
      });
    }, 32);
    return () => clearInterval(id);
  }, [total]);

  let remaining = typed;
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card/80 shadow-[0_0_80px_-20px_rgba(139,92,246,.45)] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-violet-300/20" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          ~/celentroft
        </span>
      </div>
      <div className="min-h-[15rem] space-y-1.5 p-5 font-mono text-[13px] leading-6">
        {lines.map((line, i) => {
          if (remaining <= 0) return null;
          const shown = line.text.slice(0, remaining);
          remaining -= line.text.length + 1;
          const active = remaining <= 0;
          return (
            <p
              key={i}
              className={line.prompt ? "text-foreground" : "text-violet-300"}
            >
              {line.prompt && <span className="mr-2 text-violet-500">$</span>}
              <span className={active ? "caret" : ""}>{shown}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
