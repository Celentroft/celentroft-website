"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 20_000);
  return () => clearInterval(id);
}
// Whole minutes since epoch: stable between calls, so React only re-renders on change.
const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

function minutesOfDay(date: Date, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

/** Live clock in the owner's time zone, plus the offset from the visitor's. */
export default function LocalTime({ timeZone }: { timeZone: string }) {
  const minute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (minute === null) {
    return <span className="tabular-nums">--:--</span>;
  }

  const now = new Date(minute * 60_000);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(now);

  let diff = minutesOfDay(now, timeZone) - minutesOfDay(now);
  if (diff > 720) diff -= 1440;
  if (diff <= -720) diff += 1440;
  const hours = Math.abs(diff) / 60;

  return (
    <span>
      <span className="tabular-nums text-violet-300">{time}</span>
      {" · "}
      {diff === 0
        ? "same time zone as you"
        : `${hours} h ${diff > 0 ? "ahead of" : "behind"} you`}
    </span>
  );
}
