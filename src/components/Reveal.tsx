"use client";

import { motion } from "framer-motion";
import { useStage } from "./Stage";

/**
 * Fade-up on scroll in the normal (phone) layout. In the pinned stage the timeline owns the
 * entrance, so this becomes a plain element carrying `data-layer` (its parallax depth).
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  layer = 1,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  layer?: number;
}) {
  const { active } = useStage();
  if (active) {
    return (
      <div data-layer={layer} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
