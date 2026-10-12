"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => /Mac/i.test(navigator.userAgent);
const getServerSnapshot = () => false;

/** The palette shortcut, shown as ⌘ K on Apple devices and Ctrl K elsewhere. */
export default function ShortcutKey({ className }: { className?: string }) {
  const isMac = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <kbd translate="no" className={`whitespace-nowrap ${className ?? ""}`}>
      {isMac ? "⌘" : "Ctrl"}&nbsp;K
    </kbd>
  );
}
