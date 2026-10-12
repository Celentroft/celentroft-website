"use client";

import { useEffect } from "react";

/** Small easter egg for anyone who opens the dev tools. */
export default function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "%c celentroft_ %c\nCurious how it's built? Say hi — I like people who read the console.",
      "background:#7c3aed;color:#fff;padding:4px 8px;border-radius:4px;font-weight:600",
      "color:#a78bfa",
    );
  }, []);
  return null;
}
