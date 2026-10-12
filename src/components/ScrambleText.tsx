"use client";

import { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/fx";

function shuffle(chars: string[]) {
  const a = [...chars];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Text whose letters shuffle then settle left-to-right, on load and on hover.
 *
 * The real text is never touched (so crawlers and screen readers see it once, intact):
 * while the effect plays, it is hidden and an aria-hidden overlay shows the shuffled letters.
 * Only its own letters are reordered, so the width never changes.
 */
export default function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const wrapper = useRef<HTMLSpanElement>(null);
  const overlay = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  const scramble = useCallback(() => {
    const wrap = wrapper.current;
    const layer = overlay.current;
    if (!wrap || !layer || prefersReducedMotion()) return;
    cancelAnimationFrame(frame.current);

    const letters = [...text];
    const start = performance.now();
    const duration = 750;
    let lastShuffle = 0;
    let lastSettled = -1;

    const finish = () => {
      layer.textContent = "";
      delete wrap.dataset.scrambling;
    };

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      if (progress >= 1) {
        finish();
        return;
      }
      const settled = Math.floor(progress * letters.length);
      if (settled !== lastSettled || now - lastShuffle > 55) {
        layer.textContent =
          letters.slice(0, settled).join("") + shuffle(letters.slice(settled)).join("");
        lastSettled = settled;
        lastShuffle = now;
      }
      frame.current = requestAnimationFrame(tick);
    };

    wrap.dataset.scrambling = "true";
    frame.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    scramble();
    return () => cancelAnimationFrame(frame.current);
  }, [scramble]);

  return (
    <span
      ref={wrapper}
      translate="no"
      onPointerEnter={scramble}
      className={`group relative inline-block ${className}`}
    >
      <span className="group-data-[scrambling=true]:text-transparent">{text}</span>
      <span
        ref={overlay}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 whitespace-nowrap"
      />
    </span>
  );
}
