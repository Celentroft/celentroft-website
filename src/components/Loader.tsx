"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Short intro: the name and a counter, then the curtain lifts and the first screen builds itself. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const done = () => {
      el.style.display = "none";
      window.dispatchEvent(new Event("loader:done"));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }

    const state = { n: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.to(state, {
      n: 100,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        const n = Math.round(state.n);
        if (count.current) count.current.textContent = String(n).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${n / 100})`;
      },
    })
      .to(el.querySelector("[data-loader-name]"), { yPercent: -30, opacity: 0, duration: 0.45, ease: "power2.in" })
      .add(() => {
        window.dispatchEvent(new Event("loader:done"));
      })
      .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut", onComplete: () => (el.style.display = "none") }, "<");

    // Start once the page is ready (never wait more than a moment for slow assets).
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tl.play();
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    const fallback = window.setTimeout(start, 2500);

    return () => {
      window.clearTimeout(fallback);
      window.removeEventListener("load", start);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="loader fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#06030d]"
    >
      <p
        data-loader-name
        translate="no"
        className="text-[clamp(2rem,9vw,7rem)] font-bold uppercase tracking-tighter text-white"
      >
        Celentroft<span className="text-violet-500">.</span>
      </p>
      <div className="mt-6 flex w-[min(320px,70vw)] items-center gap-4 font-mono text-xs text-violet-300">
        <span className="h-px flex-1 origin-left bg-white/10">
          <span ref={bar} className="block h-px origin-left scale-x-0 bg-violet-400" />
        </span>
        <span ref={count} className="tabular-nums">
          000
        </span>
      </div>
      <noscript>
        <style>{".loader{display:none}"}</style>
      </noscript>
    </div>
  );
}
