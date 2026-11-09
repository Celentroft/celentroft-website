"use client";

import { MotionConfig } from "framer-motion";
import { LangProvider } from "./Lang";
import { SmoothScroll } from "./Motion";

/** Every framer-motion animation honours the visitor's reduced-motion setting. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LangProvider>
        <SmoothScroll />
        {children}
      </LangProvider>
    </MotionConfig>
  );
}
