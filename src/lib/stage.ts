/** Shared, mutable state between the stage (DOM timeline) and the WebGL scene. Not reactive on purpose. */
export const stage = {
  /** True while the pinned "one screen at a time" layout is running (desktop). */
  on: false,
  /** Panel ids in order. */
  ids: [] as string[],
  /** Fractional panel index: 2.4 = 40% of the way from panel 2 to panel 3. */
  f: 0,
};

export const PANEL_EVENT = "stage:panel";
export const GOTO_EVENT = "stage:goto";

/** Pinned stage only where it works well: roomy screen, a mouse, motion allowed. */
export const STAGE_QUERY =
  "(min-width: 768px) and (min-height: 560px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
