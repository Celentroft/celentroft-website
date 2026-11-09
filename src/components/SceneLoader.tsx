"use client";

import dynamic from "next/dynamic";

// Three.js is large: load it after the page is interactive, and never on the server.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneLoader() {
  return <Scene />;
}
