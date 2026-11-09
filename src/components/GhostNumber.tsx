/** Giant outlined section number behind a heading. Sits on a slow parallax layer in the stage. */
export default function GhostNumber({ n, className = "" }: { n: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-layer="0.35"
      className={`pointer-events-none absolute -top-10 right-0 select-none font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(196_181_253/0.22)] text-[clamp(8rem,20vw,18rem)] ${className}`}
    >
      {n}
    </span>
  );
}
