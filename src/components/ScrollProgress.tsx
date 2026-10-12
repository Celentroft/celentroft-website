"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin violet line at the top of the viewport showing reading progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-violet-700 via-violet-400 to-fuchsia-400"
    />
  );
}
