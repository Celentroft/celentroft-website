export type FxKind = "matrix" | "burst";

export const FX_EVENT = "portfolio:fx";

/** Ask the global <Effects /> layer to play a full-screen effect. */
export function triggerFx(kind: FxKind) {
  window.dispatchEvent(new CustomEvent<FxKind>(FX_EVENT, { detail: kind }));
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
