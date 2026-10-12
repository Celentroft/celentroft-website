"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import ShortcutKey from "./ShortcutKey";

const links = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = links
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    // Back in the hero: nothing is highlighted.
    const hero = document.getElementById("top");
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio > 0.6) setActive("");
      },
      { threshold: [0.6] },
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          translate="no"
          className="font-mono text-sm font-semibold text-white transition-colors hover:text-violet-200"
        >
          celentroft<span className="text-violet-500">_</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.href ? "location" : undefined}
              className={`rounded-md px-2.5 py-1.5 text-sm transition-colors hover:text-white sm:px-3 ${
                active === link.href ? "text-white" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </a>
          ))}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="ml-1 flex items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-violet-400/40 hover:text-white sm:px-3"
            aria-label="Open command palette"
          >
            <FiSearch aria-hidden="true" className="text-sm sm:hidden" />
            <span className="hidden sm:inline">Search</span>
            <ShortcutKey className="hidden font-mono text-[10px] text-violet-400 sm:inline" />
          </button>
        </nav>
      </div>
    </header>
  );
}
