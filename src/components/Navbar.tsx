"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";
import { PANEL_EVENT, stage } from "@/lib/stage";
import { LangToggle, T } from "./Lang";
import ShortcutKey from "./ShortcutKey";

const links = [
  { name: "nav.about", href: "#about" },
  { name: "nav.projects", href: "#projects" },
  { name: "nav.contact", href: "#contact" },
] as const;

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
          if (entry.isIntersecting && !stage.on) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    // Back in the hero: nothing is highlighted.
    const hero = document.getElementById("top");
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!stage.on && entry?.isIntersecting && entry.intersectionRatio > 0.6) setActive("");
      },
      { threshold: [0.6] },
    );
    if (hero) heroObserver.observe(hero);

    const onPanel = (e: Event) => {
      const id = String((e as CustomEvent).detail);
      setActive(id === "top" ? "" : `#${id}`);
    };
    window.addEventListener(PANEL_EVENT, onPanel);

    return () => {
      window.removeEventListener(PANEL_EVENT, onPanel);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
      <div
        className={`mx-auto flex h-12 max-w-4xl items-center justify-between rounded-full border px-4 backdrop-blur-xl transition-colors duration-300 sm:px-5 ${
          scrolled ? "border-white/15 bg-black/55" : "border-white/10 bg-black/25"
        }`}
      >
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
              className={`whitespace-nowrap rounded-md px-1.5 py-1.5 text-[13px] transition-colors hover:text-white sm:px-3 sm:text-sm ${
                active === link.href ? "text-white" : "text-muted-foreground"
              }`}
            >
              <T k={link.name} />
            </a>
          ))}
          <LangToggle />
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            className="ml-1 flex items-center gap-2 rounded-md border max-[480px]:hidden border-border bg-card/60 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-violet-400/40 hover:text-white sm:px-3"
            aria-label="Open command palette"
          >
            <FiSearch aria-hidden="true" className="text-sm sm:hidden" />
            <span className="hidden sm:inline">
              <T k="nav.search" />
            </span>
            <ShortcutKey className="hidden font-mono text-[10px] text-violet-400 sm:inline" />
          </button>
        </nav>
      </div>
    </header>
  );
}
