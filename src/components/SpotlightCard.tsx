"use client";

import { useRef } from "react";

interface Props {
  as?: "a" | "div";
  href?: string;
  /** Opens in a new tab. Defaults to true for http(s) links. */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Card with a violet glow that follows the cursor. */
export default function SpotlightCard({
  as = "div",
  href,
  external = href?.startsWith("http") ?? false,
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const cls = `group relative block overflow-hidden rounded-2xl border border-border bg-card/70 transition-colors duration-300 hover:border-violet-400/40 ${className}`;
  const glow = (
    <span
      aria-hidden="true"
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
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        onMouseMove={onMove}
        className={cls}
      >
        {glow}
        <div className="relative h-full">{children}</div>
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} onMouseMove={onMove} className={cls}>
      {glow}
      <div className="relative h-full">{children}</div>
    </div>
  );
}
