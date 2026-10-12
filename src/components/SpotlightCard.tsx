"use client";

import { useRef } from "react";

interface Props {
  as?: "a" | "div";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

/** Card with a violet glow that follows the cursor. */
export default function SpotlightCard({
  as = "div",
  href,
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const cls = `group relative block overflow-hidden rounded-2xl border border-border bg-card/70 transition-colors duration-300 hover:border-violet-400/40 ${className}`;
  const glow = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background:
          "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgb(139 92 246 / 14%), transparent 70%)",
      }}
    />
  );

  if (as === "a") {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noreferrer"
        onMouseMove={onMove}
        className={cls}
      >
        {glow}
        <div className="relative h-full">{children}</div>
      </a>
    );
  }
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseMove={onMove}
      className={cls}
    >
      {glow}
      <div className="relative h-full">{children}</div>
    </div>
  );
}
