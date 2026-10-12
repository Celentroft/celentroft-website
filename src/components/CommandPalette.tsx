"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { triggerFx, type FxKind } from "@/lib/fx";

export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  hint: string;
  href?: string;
  external?: boolean;
  copy?: string;
  fx?: FxKind;
}

export const OPEN_PALETTE_EVENT = "open-palette";

export default function CommandPalette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(q));
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const item of results) map.set(item.group, [...(map.get(item.group) ?? []), item]);
    return [...map.entries()];
  }, [results]);

  const active = results[Math.min(index, results.length - 1)];

  useEffect(() => {
    const reset = () => {
      setQuery("");
      setIndex(0);
      setStatus("");
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

  // Focus the input, lock the page scroll, and hand the focus back on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      html.style.overflow = overflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [open]);

  // Keep the highlighted option visible while navigating with the keyboard.
  useEffect(() => {
    if (open && active) {
      document.getElementById(`palette-${active.id}`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, active]);

  const run = async (item: PaletteItem) => {
    if (item.copy) {
      try {
        await navigator.clipboard.writeText(item.copy);
        setStatus(`${item.hint} copied to the clipboard`);
        setTimeout(() => setOpen(false), 800);
      } catch {
        setStatus("Copy failed");
      }
      return;
    }
    setOpen(false);
    if (item.fx) triggerFx(item.fx);
    if (item.href) {
      if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
      else window.location.hash = item.href;
    }
  };

  if (!open) return null;

  const move = (delta: number) => {
    if (results.length === 0) return;
    setIndex((i) => (i + delta + results.length) % results.length);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overscroll-contain bg-black/70 px-4 pt-[16vh] backdrop-blur-sm"
      onMouseDown={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-violet-500/30 bg-popover shadow-[0_0_80px_-10px_rgba(139,92,246,.4)]"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Focus stays on the search field: nothing else in the dialog is tabbable.
          if (e.key === "Tab") e.preventDefault();
        }}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 focus-within:border-violet-400/50">
          <FiSearch aria-hidden="true" className="shrink-0 text-violet-400" />
          <input
            ref={inputRef}
            name="palette-search"
            role="combobox"
            aria-label="Search commands"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={active ? `palette-${active.id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                move(1);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                move(-1);
              } else if (e.key === "Enter" && active) {
                e.preventDefault();
                run(active);
              }
            }}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Go to, open, copy…"
            className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>

        <div
          id="palette-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto overscroll-contain p-2"
        >
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Nothing found.</p>
          )}
          {groups.map(([group, groupItems]) => (
            <div key={group} role="group" aria-label={group} className="mb-1 last:mb-0">
              <p
                aria-hidden="true"
                className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-zinc-600"
              >
                {group}
              </p>
              {groupItems.map((item) => {
                const selected = item.id === active?.id;
                return (
                  <button
                    key={item.id}
                    id={`palette-${item.id}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    onMouseMove={() => setIndex(results.indexOf(item))}
                    onClick={() => run(item)}
                    className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selected ? "bg-violet-500/15 text-white" : "text-zinc-300"
                    }`}
                  >
                    <span className="min-w-0 truncate">{item.label}</span>
                    <span
                      translate="no"
                      className="max-w-[45%] shrink-0 truncate font-mono text-xs text-muted-foreground"
                    >
                      {item.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {status || `${results.length} results`}
        </p>
        {status && (
          <p aria-hidden="true" className="border-t border-border px-4 py-2.5 text-xs text-emerald-400">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
