"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

export interface PaletteItem {
  label: string;
  hint: string;
  href?: string;
  external?: boolean;
  copy?: string;
}

export const OPEN_PALETTE_EVENT = "open-palette";

export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () =>
      items.filter((i) =>
        `${i.label} ${i.hint}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  useEffect(() => {
    const reset = () => {
      setQuery("");
      setIndex(0);
      setCopied(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        reset();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => {
      reset();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const run = async (item: PaletteItem) => {
    if (item.copy) {
      try {
        await navigator.clipboard.writeText(item.copy);
        setCopied(true);
        setTimeout(() => setOpen(false), 700);
      } catch {
        setOpen(false);
      }
      return;
    }
    setOpen(false);
    if (item.href) {
      if (item.external) window.open(item.href, "_blank", "noreferrer");
      else window.location.hash = item.href;
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[18vh] backdrop-blur-sm"
      onMouseDown={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-violet-500/30 bg-popover shadow-[0_0_80px_-10px_rgba(139,92,246,.4)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <FiSearch className="text-violet-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[index]) {
                run(results[index]);
              }
            }}
            placeholder="Go to, open, copy…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              Nothing found.
            </li>
          )}
          {results.map((item, i) => (
            <li key={item.label}>
              <button
                onMouseEnter={() => setIndex(i)}
                onClick={() => run(item)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  i === index ? "bg-violet-500/15 text-white" : "text-zinc-300"
                }`}
              >
                <span>
                  {item.copy && copied && i === index ? "Copied ✓" : item.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
