"use client";

import { useEffect, useRef } from "react";

/** Hero background: a faint grid that lights up around the mouse pointer. */
export default function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--hx", `${x - rect.left}px`);
      el.style.setProperty("--hy", `${y - rect.top}px`);
      el.style.setProperty("--ho", "1");
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => el.style.setProperty("--ho", "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      <div className="bg-grid absolute inset-0" />
      <div className="bg-grid-hot absolute inset-0" />
    </div>
  );
}
