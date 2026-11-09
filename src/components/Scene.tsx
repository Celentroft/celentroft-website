"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { stage } from "@/lib/stage";

/**
 * Fixed WebGL backdrop driven by scroll: a giant metallic "C" inside a curved grid room.
 * The letter and the camera glide between one pose per section (hero → about → terminal →
 * projects → contact), and the background drifts from near-black to deep violet.
 */

type Pose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  s: number;
  cz: number;
  tint: number;
  /** accent hue, 0..1 */
  h: number;
};

// One pose per section id, in page order. The letter parks in a corner (clear of the text) and
// only sweeps through the middle of the screen while panels change.
const STOPS: { id: string; pose: Pose }[] = [
  { id: "top", pose: { x: 0, y: 0.1, z: -3, rx: 0, ry: 0, s: 1, cz: 9, tint: 0, h: 0.74 } },
  { id: "about", pose: { x: 8.6, y: -3.1, z: -5, rx: 0.1, ry: -1.1, s: 0.55, cz: 8, tint: 0.25, h: 0.68 } },
  { id: "terminal", pose: { x: -7.4, y: 2.4, z: -6, rx: -0.1, ry: 0.9, s: 0.6, cz: 8.5, tint: 0.4, h: 0.58 } },
  { id: "projects", pose: { x: 8, y: 3, z: -8, rx: 0.2, ry: 2.2, s: 0.6, cz: 9, tint: 0.6, h: 0.86 } },
  { id: "community", pose: { x: -7.6, y: -2.4, z: -6, rx: -0.15, ry: 2.9, s: 0.6, cz: 8.5, tint: 0.8, h: 0.7 } },
  { id: "contact", pose: { x: 7.6, y: -2.2, z: -7, rx: 0.1, ry: 3.4, s: 0.72, cz: 9, tint: 1, h: 0.78 } },
];

const WHITE = new THREE.Color("#ffffff");
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mix(a: Pose, b: Pose, t: number): Pose {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
    rx: lerp(a.rx, b.rx, t),
    ry: lerp(a.ry, b.ry, t),
    s: lerp(a.s, b.s, t),
    cz: lerp(a.cz, b.cz, t),
    tint: lerp(a.tint, b.tint, t),
    h: lerp(a.h, b.h, t),
  };
}

const GRID_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const GRID_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uGlow;
  void main() {
    vec2 g = vUv * vec2(72.0, 20.0);
    vec2 f = abs(fract(g - 0.5) - 0.5) / fwidth(g);
    float line = 1.0 - min(min(f.x, f.y), 1.0);
    // small crosses at every 4th intersection
    vec2 c = abs(fract(g * 0.25 - 0.5) - 0.5) * 4.0;
    float cross = (1.0 - smoothstep(0.0, 0.07, min(c.x, c.y))) * (1.0 - smoothstep(0.0, 0.22, max(c.x, c.y)));
    float fade = smoothstep(0.0, 0.25, vUv.y) * (1.0 - smoothstep(0.75, 1.0, vUv.y));
    float a = (line * 0.16 + cross * 0.5) * fade * uGlow;
    gl_FragColor = vec4(uColor, a);
  }
`;

function buildLetter() {
  // A geometric "C": a thick ring with a gap on the right.
  const gap = 0.62;
  const outer = 3;
  const inner = 1.85;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outer, gap, Math.PI * 2 - gap, false);
  shape.absarc(0, 0, inner, Math.PI * 2 - gap, gap, true);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.1,
    bevelEnabled: true,
    bevelSize: 0.1,
    bevelThickness: 0.1,
    bevelSegments: 2,
    curveSegments: 56,
  });
  geo.center();
  return geo;
}

export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const small = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !small,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL: the page simply keeps its plain dark background
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bg = new THREE.Color();
    const accent = new THREE.Color();
    scene.background = bg;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

    // Curved grid room around the camera.
    const roomMat = new THREE.ShaderMaterial({
      vertexShader: GRID_VERT,
      fragmentShader: GRID_FRAG,
      uniforms: { uColor: { value: new THREE.Color("#a78bfa") }, uGlow: { value: 1 } },
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide,
    });
    const room = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 60, 96, 1, true), roomMat);
    scene.add(room);

    // The letter + its violet outline.
    const letterGeo = buildLetter();
    const letter = new THREE.Group();
    letter.add(
      new THREE.Mesh(
        letterGeo,
        new THREE.MeshStandardMaterial({
          color: "#241a40",
          metalness: 1,
          roughness: 0.3,
          envMapIntensity: 0.85,
        }),
      ),
    );
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(letterGeo, 35),
      new THREE.LineBasicMaterial({ color: "#c4b5fd", transparent: true, opacity: 0.7 }),
    );
    letter.add(edges);
    scene.add(letter);

    const key = new THREE.PointLight("#8b5cf6", 90, 40);
    key.position.set(5, 4, 6);
    scene.add(key);
    scene.add(new THREE.AmbientLight("#ffffff", 0.2));

    // Drifting dust.
    const count = small ? 120 : 360;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: "#c4b5fd", size: 0.06, transparent: true, opacity: 0.55, depthWrite: false }),
    );
    scene.add(dust);

    // Thin orbiting rings: parallax depth cues that spin up during transitions.
    const ringMat = new THREE.MeshBasicMaterial({ color: "#a78bfa", transparent: true, opacity: 0.4, depthWrite: false });
    const rings = [
      { r: 5.2, z: -6, tilt: 1.15, speed: 0.12 },
      { r: 7.6, z: -9, tilt: 0.7, speed: -0.08 },
      { r: 3.6, z: -2, tilt: 1.4, speed: 0.2 },
    ].map(({ r, z, tilt, speed }) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 6, small ? 96 : 192), ringMat);
      mesh.position.z = z;
      mesh.rotation.x = tilt;
      mesh.userData.speed = speed;
      scene.add(mesh);
      return mesh;
    });

    // Scroll anchors: where each section starts, in page pixels (classic scrolling layout only).
    let anchors: number[] = [];
    let stops = STOPS;
    const measure = () => {
      const found = STOPS.map((stop) => ({ stop, el: document.getElementById(stop.id) })).filter(
        (x) => x.el,
      );
      stops = found.length >= 2 ? found.map((x) => x.stop) : STOPS;
      anchors =
        found.length >= 2
          ? found.map((x) => x.el!.getBoundingClientRect().top + window.scrollY)
          : STOPS.map((_, i) => (i / (STOPS.length - 1)) * Math.max(1, document.documentElement.scrollHeight));
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      measure();
    };
    resize();
    window.addEventListener("resize", resize);
    // Layout shifts after fonts/data: re-measure shortly after load.
    const remeasure = window.setTimeout(measure, 1200);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const poseAt = (y: number): Pose => {
      if (stage.on) {
        // Pinned stage: follow the panel index instead of the page position.
        const list = stage.ids.map((id) => (STOPS.find((s) => s.id === id) ?? STOPS[0]).pose);
        if (list.length < 2) return list[0] ?? STOPS[0].pose;
        const f = Math.min(Math.max(stage.f, 0), list.length - 1);
        const i = Math.min(Math.floor(f), list.length - 2);
        return mix(list[i], list[i + 1], smooth(f - i));
      }
      // y is the line at the vertical middle of the viewport.
      const line = y + window.innerHeight * 0.35;
      if (line <= anchors[0]) return stops[0].pose;
      for (let i = 0; i < stops.length - 1; i++) {
        if (line < anchors[i + 1]) {
          const span = Math.max(1, anchors[i + 1] - anchors[i]);
          return mix(stops[i].pose, stops[i + 1].pose, smooth((line - anchors[i]) / span));
        }
      }
      return stops[stops.length - 1].pose;
    };

    const cur: Pose = { ...STOPS[0].pose };
    let prevF = 0;
    let warp = 0;
    let frame = 0;
    let running = true;
    let last = performance.now();
    let elapsed = 0;

    const render = () => {
      if (!running) return;
      frame = requestAnimationFrame(render);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;
      const t = elapsed;
      const target = poseAt(window.scrollY);
      const k = reduced ? 1 : 1 - Math.pow(stage.on ? 0.02 : 0.0015, dt); // frame-rate independent easing

      // Transition "warp": the faster the panels change, the wider the lens and the closer the camera.
      const rate = stage.on ? Math.abs(stage.f - prevF) / Math.max(dt, 0.001) : 0;
      prevF = stage.f;
      warp = lerp(warp, Math.min(rate, 2.2), 1 - Math.pow(0.002, dt));
      const fov = 40 + warp * 7;
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      (Object.keys(cur) as (keyof Pose)[]).forEach((p) => {
        cur[p] = lerp(cur[p], target[p], k);
      });

      const narrow = camera.aspect < 0.9;
      const spread = narrow ? 0.3 : 1;
      const scale = cur.s * (narrow ? 0.72 : 1) * (1 + (stage.on ? Math.min(warp / 1.4, 1) : 0) * 0.45);
      // While panels change, the letter swings toward the middle and swells, then settles back in its corner.
      const pull = stage.on ? Math.min(warp / 1.4, 1) : 0;
      letter.position.set(cur.x * spread * (1 - pull * 0.75), cur.y * (1 - pull * 0.6), cur.z + pull * 3);
      letter.rotation.set(cur.rx, cur.ry + (reduced ? 0 : Math.sin(t * 0.3) * 0.12 + warp * 0.35), 0);
      letter.scale.setScalar(scale);

      camera.position.set(pointer.x * 0.5, -pointer.y * 0.3, cur.cz + (narrow ? 4 : 0));
      camera.lookAt(0, 0, -2);

      room.rotation.y = reduced ? 0 : t * 0.01 + (stage.on ? stage.f * 0.5 : window.scrollY * 0.00018);
      dust.rotation.y = reduced ? 0 : t * 0.01;
      dust.position.y = stage.on ? stage.f * -1.4 : window.scrollY * -0.0007;

      // Each section has its own hue: backdrop, grid, lights and rings all follow it.
      bg.setHSL(cur.h, 0.55, 0.014 + cur.tint * 0.03);
      accent.setHSL(cur.h, 0.9, 0.7);
      roomMat.uniforms.uColor.value.copy(accent);
      roomMat.uniforms.uGlow.value = lerp(0.85, 1.15, cur.tint);
      key.color.copy(accent);
      (edges.material as THREE.LineBasicMaterial).color.copy(accent).lerp(WHITE, 0.35);
      (dust.material as THREE.PointsMaterial).color.copy(accent);
      ringMat.color.copy(accent);
      rings.forEach((ring, i) => {
        ring.rotation.z += (reduced ? 0 : ring.userData.speed * dt) * (1 + warp * 6);
        ring.rotation.y = Math.sin(t * 0.15 + i) * 0.2 + (stage.on ? stage.f * 0.3 * (i + 1) : 0);
      });

      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(remeasure);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      letterGeo.dispose();
      ringMat.dispose();
      rings.forEach((ring) => ring.geometry.dispose());
      dustGeo.dispose();
      roomMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
      {/* keeps text legible over the 3D scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(6_3_13/0.55)_100%)]"
      />
    </>
  );
}
