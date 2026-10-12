"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";

const links = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-background/80 backdrop-blur-xl"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-semibold text-white">
          celentroft<span className="text-violet-500">_</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-white sm:block"
            >
              {l.name}
            </a>
          ))}
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-violet-400/40 hover:text-white"
            aria-label="Open command palette"
          >
            Search
            <kbd className="font-mono text-[10px] text-violet-400">Ctrl K</kbd>
          </button>
        </nav>
      </div>
    </header>
  );
}
