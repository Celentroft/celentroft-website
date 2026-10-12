"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FX_EVENT, prefersReducedMotion, type FxKind } from "@/lib/fx";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>{}[]();=+*/#$";

function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function MatrixRain({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 16;
    let frame = 0;
    let last = 0;
    let drops: number[] = [];
    let view = setupCanvas(canvas);

    const reset = () => {
      view = setupCanvas(canvas);
      if (!view) return;
      view.ctx.fillStyle = "#06030d";
      view.ctx.fillRect(0, 0, view.w, view.h);
      drops = Array.from({ length: Math.ceil(view.w / size) }, () => -Math.random() * 40);
    };
    reset();

    const draw = (t: number) => {
      frame = requestAnimationFrame(draw);
      if (!view || t - last < 45) return;
      last = t;
      const { ctx, w, h } = view;
      ctx.fillStyle = "rgba(6, 3, 13, 0.1)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${size}px ui-monospace, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * size;
        if (y > 0) {
          ctx.fillStyle = Math.random() > 0.96 ? "#f5f3ff" : "#8b5cf6";
          ctx.fillText(GLYPHS[Math.floor(Math.random() * GLYPHS.length)], i * size, y);
        }
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    frame = requestAnimationFrame(draw);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLeaving(true);
    };
    window.addEventListener("resize", reset);
    window.addEventListener("keydown", onKey);
    const stop = setTimeout(() => setLeaving(true), 9000);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(stop);
      window.removeEventListener("resize", reset);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(onDone, 500);
    return () => clearTimeout(id);
  }, [leaving, onDone]);

  return (
    <div
      onClick={() => setLeaving(true)}
      className={`fixed inset-0 z-[90] cursor-pointer transition-opacity duration-500 animate-in fade-in ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
      <p
        role="status"
        className="absolute inset-x-0 bottom-8 text-center font-mono text-xs text-violet-300"
      >
        wake up… <span className="text-violet-500">(esc or click to exit)</span>
      </p>
    </div>
  );
}

function Burst({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const view = setupCanvas(canvas);
    if (!view) return;
    const { ctx, w, h } = view;
    const colors = ["#a78bfa", "#8b5cf6", "#c4b5fd", "#e879f9", "#ffffff"];
    const particles = Array.from({ length: 150 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 10;
      return {
        x: w / 2,
        y: h * 0.55,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 2 + Math.random() * 4,
        life: 1,
        decay: 0.011 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
        round: Math.random() > 0.5,
      };
    });

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive++;
        p.vy += 0.22;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        if (p.round) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;
      if (alive > 0) frame = requestAnimationFrame(draw);
      else onDone();
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
    />
  );
}

/**
 * Global full-screen effects, triggered by the terminal, the palette
 * or the Konami code (↑ ↑ ↓ ↓ ← → ← → B A).
 */
export default function Effects() {
  const [fx, setFx] = useState<FxKind | null>(null);

  useEffect(() => {
    let progress = 0;

    const start = (kind: FxKind) => {
      if (!prefersReducedMotion()) setFx(kind);
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        start("matrix");
      }
    };
    const onFx = (e: Event) => start((e as CustomEvent<FxKind>).detail);

    window.addEventListener("keydown", onKey);
    window.addEventListener(FX_EVENT, onFx);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(FX_EVENT, onFx);
    };
  }, []);

  const done = useCallback(() => setFx(null), []);
  return (
    <>
      {fx === "matrix" && <MatrixRain onDone={done} />}
      {fx === "burst" && <Burst onDone={done} />}
    </>
  );
}
