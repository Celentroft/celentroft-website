"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { GOTO_EVENT, PANEL_EVENT, STAGE_QUERY, stage } from "@/lib/stage";

/**
 * "One screen at a time" layout, like a pinned film: the viewport never leaves the page,
 * scrolling plays a timeline that flies the current panel out and the next one in (3D),
 * while the WebGL scene behind follows. Phones and reduced-motion users get the same
 * panels as a normal scrolling page.
 */

export type PanelDef = { id: string; label: string; node: React.ReactNode };

/** A panel can own extra scroll steps (e.g. the project carousel). */
export type StageHook = { steps: number; apply: (progress: number) => void };

type Ctx = { active: boolean; register: (id: string, hook: StageHook) => () => void };
const StageContext = createContext<Ctx>({ active: false, register: () => () => {} });
export const useStage = () => useContext(StageContext);

function subscribe(cb: () => void) {
  const mql = window.matchMedia(STAGE_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
const getSnapshot = () => window.matchMedia(STAGE_QUERY).matches;

const TRANSITION = 1.1; // timeline units a panel change takes
const DWELL = 0.35; // pause before a transition starts
const STEP = 0.9; // timeline units per carousel card
const PX_PER_UNIT = 0.8; // viewport heights of scrolling per timeline unit

export default function Stage({ panels }: { panels: PanelDef[] }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const hooks = useRef<Record<string, StageHook>>({});
  const [current, setCurrent] = useState(0);
  const goToRef = useRef<(index: number) => void>(() => {});

  const register = useCallback((id: string, hook: StageHook) => {
    hooks.current[id] = hook;
    return () => {
      if (hooks.current[id] === hook) delete hooks.current[id];
    };
  }, []);
  const ctx = useMemo(() => ({ active, register }), [active, register]);

  const ids = useMemo(() => panels.map((p) => p.id), [panels]);

  useEffect(() => {
    if (!active) return;
    const pin = pinRef.current;
    const wrap = wrapRef.current;
    if (!pin || !wrap) return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const panelEls = Array.from(pin.querySelectorAll<HTMLElement>(":scope > .stage-panel"));
    const N = panelEls.length;
    if (N < 2) return;

    const layersOf = (el: HTMLElement) =>
      Array.from(el.querySelectorAll<HTMLElement>("[data-layer]"));
    const depth = (el: HTMLElement) => Number(el.dataset.layer) || 1;
    const wordsOf = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>(".wi"));

    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto"; // the page CSS asks for smooth: it would fight the scrubbed timeline

    const transitions: number[] = [];
    let trigger: ScrollTrigger | undefined;
    let tl: gsap.core.Timeline | undefined;

    const context = gsap.context(() => {
      const IN_FROM = { scale: 1.14, z: 220, rotateX: -12, yPercent: 9 };
      const SETTLED = { scale: 1, z: 0, rotateX: 0, yPercent: 0 };
      const OUT_TO = { scale: 0.88, z: -260, rotateX: 12, yPercent: -7 };

      // Everything but the first panel waits off-stage.
      panelEls.slice(1).forEach((el) => {
        gsap.set(el, { ...IN_FROM, autoAlpha: 0 });
        layersOf(el).forEach((l) => gsap.set(l, { y: 50 + depth(l) * 34, opacity: 0 }));
        gsap.set(wordsOf(el), { yPercent: 115 });
      });
      gsap.set(panelEls[0], { transformOrigin: "50% 60%" });

      tl = gsap.timeline({ defaults: { ease: "none" } });
      let t = 0;
      tl.addLabel("p0", 0);

      for (let i = 0; i < N - 1; i++) {
        const hook = hooks.current[ids[i]];
        if (hook && hook.steps > 1) {
          const proxy = { p: 0 };
          const dur = (hook.steps - 1) * STEP;
          hook.apply(0);
          tl.to(proxy, { p: 1, duration: dur, ease: "none", onUpdate: () => hook.apply(proxy.p) }, t);
          for (let k = 1; k < hook.steps; k++) tl.addLabel(`p${i}-${k}`, t + k * STEP);
          t += dur;
        }
        t += DWELL;
        transitions.push(t);

        const from = panelEls[i];
        const to = panelEls[i + 1];

        // Out: the panel recedes into depth, its layers drift up at different speeds.
        tl.fromTo(from, SETTLED, { ...OUT_TO, duration: TRANSITION, ease: "power2.in" }, t);
        tl.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.6, ease: "power1.in" }, t + 0.05);
        layersOf(from).forEach((l) =>
          tl!.fromTo(
            l,
            { y: 0, opacity: 1 },
            { y: -30 - depth(l) * 24, opacity: 0, duration: 0.55, ease: "power2.in" },
            t,
          ),
        );

        if (wordsOf(from).length) {
          tl.fromTo(
            wordsOf(from),
            { yPercent: 0 },
            { yPercent: -115, duration: 0.5, ease: "power2.in", stagger: 0.02 },
            t,
          );
        }

        // A skewed bar of light sweeps across the screen as the scene changes.
        if (sweepRef.current) {
          tl.fromTo(
            sweepRef.current,
            { xPercent: -130, autoAlpha: 0 },
            { xPercent: 300, duration: TRANSITION * 0.95, ease: "power2.inOut" },
            t,
          )
            .fromTo(sweepRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, t)
            .to(sweepRef.current, { autoAlpha: 0, duration: 0.55, ease: "power1.in" }, t + 0.45);
        }

        // In: the next panel rushes forward from depth, layers settle one after another.
        tl.fromTo(
          to,
          IN_FROM,
          { ...SETTLED, duration: TRANSITION, ease: "power3.out" },
          t + 0.12,
        );
        tl.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, t + 0.4);
        layersOf(to).forEach((l) =>
          tl!.fromTo(
            l,
            { y: 50 + depth(l) * 34, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            t + 0.4 + depth(l) * 0.08,
          ),
        );

        if (wordsOf(to).length) {
          tl.fromTo(
            wordsOf(to),
            { yPercent: 115 },
            { yPercent: 0, duration: 0.95, ease: "power4.out", stagger: 0.05 },
            t + 0.5,
          );
        }

        t += TRANSITION + 0.12;
        tl.addLabel(`p${i + 1}`, t);
      }
      tl.to({}, { duration: 0.01 }, t); // make sure the timeline ends exactly at the last label

      // The ghost headline slides across the whole film.
      if (tickerRef.current) {
        tl.fromTo(tickerRef.current, { xPercent: 6 }, { xPercent: -62, duration: t, ease: "none" }, 0);
      }

      let lastIdx = -1;
      tl.eventCallback("onUpdate", () => {
        const time = tl!.time();
        let f = 0;
        for (let i = 0; i < transitions.length; i++) {
          const s = transitions[i] + 0.12;
          if (time >= s + TRANSITION - 0.12) {
            f = i + 1;
          } else {
            if (time > transitions[i]) f = i + Math.min(1, (time - transitions[i]) / TRANSITION);
            break;
          }
        }
        stage.f = f;
        const idx = Math.round(f);
        if (idx !== lastIdx) {
          lastIdx = idx;
          setCurrent(idx);
          window.dispatchEvent(new CustomEvent(PANEL_EVENT, { detail: ids[idx] }));
        }
      });

      trigger = ScrollTrigger.create({
        animation: tl,
        trigger: pin,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * PX_PER_UNIT * tl!.duration())}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: "labelsDirectional",
          duration: { min: 0.35, max: 1 },
          delay: 0.06,
          ease: "power2.inOut",
        },
      });
    }, wrap);

    // After the loader lifts, the first screen builds itself.
    const onIntro = () => {
      const first = panelEls[0];
      gsap.from(layersOf(first), { y: 70, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.09 });
    };
    window.addEventListener("loader:done", onIntro);

    stage.on = true;
    stage.ids = ids;
    stage.f = 0;

    const goTo = (index: number) => {
      if (!trigger || !tl) return;
      const time = tl.labels[`p${index}`];
      if (time === undefined) return;
      const y = trigger.start + (time / tl.duration()) * (trigger.end - trigger.start);
      // A tween on the scroll position (not the browser's smooth scroll): the film follows it frame by frame.
      gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.7, ease: "power3.inOut", overwrite: true });
    };
    goToRef.current = goTo;

    const onGoto = (e: Event) => {
      const id = String((e as CustomEvent).detail ?? "").replace(/^#/, "");
      const index = ids.indexOf(id);
      if (index < 0) return;
      e.preventDefault();
      goTo(index);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = (a.getAttribute("href") ?? "").slice(1);
      if (!ids.includes(id)) return;
      e.preventDefault();
      goTo(ids.indexOf(id));
    };
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (ids.includes(id)) goTo(ids.indexOf(id));
    };
    window.addEventListener(GOTO_EVENT, onGoto);
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);

    // Land on the right panel when opened with a #hash.
    const initial = window.location.hash.slice(1);
    const first = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (ids.includes(initial)) goTo(ids.indexOf(initial));
    }, 300);

    return () => {
      window.clearTimeout(first);
      window.removeEventListener(GOTO_EVENT, onGoto);
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("loader:done", onIntro);
      html.style.scrollBehavior = prevBehavior;
      stage.on = false;
      stage.f = 0;
      goToRef.current = () => {};
      context.revert();
    };
  }, [active, ids]);

  return (
    <StageContext.Provider value={ctx}>
      <div ref={wrapRef} className={active ? "is-stage" : undefined}>
        <div ref={pinRef} className="stage-pin">
          {active && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-[3vh] z-0 overflow-hidden"
            >
              <div
                ref={tickerRef}
                translate="no"
                className="whitespace-nowrap text-[clamp(5rem,16vw,15rem)] font-bold uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(196_181_253/0.16)]"
              >
                Python — TypeScript — Rust — Go — Discord Bots — Automation —
              </div>
            </div>
          )}
          {active && (
            <div
              ref={sweepRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-[45vw] -skew-x-12 bg-gradient-to-r from-transparent via-violet-300/20 to-transparent opacity-0 mix-blend-screen"
            />
          )}
          {panels.map((panel) => (
            <div key={panel.id} data-id={panel.id} className="stage-panel">
              {panel.node}
            </div>
          ))}
        </div>

        {active && (
          <div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-6 left-6 z-40 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300 md:block"
          >
            <span className="text-violet-300">{String(current + 1).padStart(2, "0")}</span>
            <span className="text-zinc-500"> / {String(panels.length).padStart(2, "0")}</span>
            <span className="ml-3 text-zinc-400">{panels[current]?.label}</span>
          </div>
        )}

        {active && (
          <nav
            aria-label="Sections"
            className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
          >
            <ol className="flex flex-col items-end gap-1">
              {panels.map((panel, i) => (
                <li key={panel.id}>
                  <button
                    type="button"
                    onClick={() => goToRef.current(i)}
                    aria-label={panel.label}
                    aria-current={current === i ? "step" : undefined}
                    className="group/dot flex min-h-6 items-center gap-3"
                  >
                    <span
                      className={`font-mono text-[11px] uppercase tracking-widest transition-opacity ${
                        current === i
                          ? "text-violet-300 opacity-100"
                          : "text-zinc-400 opacity-0 group-hover/dot:opacity-100"
                      }`}
                    >
                      {panel.label}
                    </span>
                    <span
                      className={`block h-1.5 rounded-full transition-all ${
                        current === i ? "w-6 bg-violet-400" : "w-1.5 bg-zinc-500 group-hover/dot:bg-zinc-300"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </StageContext.Provider>
  );
}
