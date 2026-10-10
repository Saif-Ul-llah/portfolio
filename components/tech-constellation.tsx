"use client";

import { useEffect, useRef } from "react";
import { isMotionOff, onMotionChange } from "@/lib/motion";

type Props = {
  names: string[];
  /** Names to emphasise (a selected category or a hovered tile). */
  highlight: Set<string>;
  className?: string;
};

const STARS = 160;

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function fibonacciSphere(n: number) {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

/** Each node links to its 3 nearest neighbours. */
function nearestEdges(pts: [number, number, number][]) {
  const edges = new Set<string>();
  pts.forEach((a, i) => {
    pts
      .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach(({ j }) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });
  return [...edges].map((e) => e.split("-").map(Number) as [number, number]);
}

const channels = (el: Element, v: string) => getComputedStyle(el).getPropertyValue(v).trim().split(/\s+/).join(",");

/**
 * A draggable 3D "constellation" of the stack, drawn on canvas: tools are
 * nodes on a slowly rotating sphere inside a shell of drifting star particles.
 */
export function TechConstellation({ names, highlight, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const highlightRef = useRef(highlight);
  highlightRef.current = highlight;
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => redrawRef.current(), [highlight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const nodes = fibonacciSphere(names.length);
    const edges = nearestEdges(nodes);
    const stars = Array.from({ length: STARS }, () => {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = 1.18 + Math.random() * 0.35;
      const s = Math.sqrt(1 - u * u);
      return [Math.cos(t) * s * r, u * r, Math.sin(t) * s * r] as [number, number, number];
    });

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let still = reduce || isMotionOff();
    let W = 0;
    let H = 0;
    let dpr = 1;
    let rotY = 0.6;
    let rotX = -0.25;
    let velY = 0.0025;
    let velX = 0;
    let dragging = false;
    let last = { x: 0, y: 0 };
    let visible = true;
    let raf = 0;
    let ink = "240,239,234";
    let accent = "139,132,255";

    const readColors = () => {
      ink = channels(canvas, "--ink") || ink;
      accent = channels(canvas, "--accent") || accent;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.round(r.width * dpr);
      H = Math.round(r.height * dpr);
      canvas.width = W;
      canvas.height = H;
      draw();
    };

    const project = (p: [number, number, number]) => {
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const x1 = p[0] * cy - p[2] * sy;
      const z1 = p[0] * sy + p[2] * cy;
      const y2 = p[1] * cx - z1 * sx;
      const z2 = p[1] * sx + z1 * cx;
      const R = Math.min(W, H) * 0.34;
      const s = 2.8 / (2.8 - z2);
      return { x: W / 2 + x1 * R * s, y: H / 2 + y2 * R * s, z: z2, s };
    };

    function draw() {
      if (!W || !H) return;
      ctx!.clearRect(0, 0, W, H);
      const hl = highlightRef.current;
      const hasHl = hl.size > 0;

      for (const st of stars) {
        const p = project(st);
        const a = 0.08 + ((p.z + 1.5) / 3) * 0.35;
        ctx!.fillStyle = `rgba(${ink},${a.toFixed(3)})`;
        ctx!.fillRect(p.x, p.y, 1.2 * dpr * p.s, 1.2 * dpr * p.s);
      }

      const proj = nodes.map(project);
      ctx!.lineWidth = dpr;
      for (const [i, j] of edges) {
        const a = proj[i];
        const b = proj[j];
        const lit = hasHl && hl.has(names[i]) && hl.has(names[j]);
        const depth = ((a.z + b.z) / 2 + 1) / 2;
        ctx!.strokeStyle = lit
          ? `rgba(${accent},${(0.35 + depth * 0.5).toFixed(3)})`
          : `rgba(${ink},${(0.04 + depth * (hasHl ? 0.08 : 0.16)).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // Back to front so near nodes paint over far ones.
      const order = proj.map((p, i) => ({ p, i })).sort((a, b) => a.p.z - b.p.z);
      ctx!.textAlign = "center";
      for (const { p, i } of order) {
        const depth = (p.z + 1) / 2;
        const lit = hl.has(names[i]);
        const dim = hasHl && !lit;
        const r = (lit ? 4.5 : 2 + depth * 2.2) * dpr;
        if (lit) {
          ctx!.fillStyle = `rgba(${accent},0.18)`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.fillStyle = lit ? `rgb(${accent})` : `rgba(${ink},${(dim ? 0.15 : 0.3 + depth * 0.6).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx!.fill();

        if (lit || (!hasHl && p.z > 0.35)) {
          ctx!.font = `${lit ? 600 : 400} ${11 * dpr}px ui-monospace, monospace`;
          ctx!.fillStyle = lit ? `rgb(${ink})` : `rgba(${ink},${(0.25 + (p.z - 0.35) * 1.1).toFixed(3)})`;
          ctx!.fillText(names[i], p.x, p.y - r - 6 * dpr);
        }
      }
    }
    redrawRef.current = draw;

    const loop = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (!dragging) {
        rotY += velY;
        rotX += velX;
        // Ease back to the slow idle spin after a flick.
        velY += ((still ? 0 : 0.0025) - velY) * 0.03;
        velX *= 0.94;
        rotX += (-0.25 - rotX) * 0.01;
      }
      draw();
      const moving = Math.abs(velY) > 0.0002 || Math.abs(velX) > 0.0002 || dragging;
      if (!still || moving) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      last = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      rotY += dx * 0.008;
      rotX = Math.max(-1.2, Math.min(1.2, rotX + dy * 0.006));
      velY = dx * 0.008;
      velX = dy * 0.002;
    };
    const onUp = () => {
      dragging = false;
      start();
    };

    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const offMotion = onMotionChange(() => {
      still = reduce || isMotionOff();
      start();
    });
    const onVisibility = () => !document.hidden && start();
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      offMotion();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [names]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block aspect-square w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
    />
  );
}
