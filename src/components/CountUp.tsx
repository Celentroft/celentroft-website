"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { prefersReducedMotion } from "@/lib/fx";

/** Number that counts up from 0 on load. The server renders the final value. */
export default function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0 || prefersReducedMotion()) return;
    el.textContent = "0";
    const controls = animate(0, value, {
      duration: 1.4,
      delay: 0.45,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums" suppressHydrationWarning>
      {value}
    </span>
  );
}
