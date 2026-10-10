"use client";

import { useEffect, useRef } from "react";
import { isMotionOff, onMotionChange } from "@/lib/motion";

type Source =
  | { kind: "image"; src: string }
  | { kind: "text"; text: string; weight?: number };

type Props = {
  source: Source;
  /** Distance between sampled particles, in CSS pixels. */
  gap?: number;
  /** "sample" keeps the source pixel colors, "current" uses the CSS `color` of the canvas. */
  colorMode?: "sample" | "current";
  /** Rising particles that peel off the top edge of the shape. */
  embers?: boolean;
  /** Gamma lift for sampled colors so dark areas stay visible on a dark backdrop (1 = none). */
  gamma?: number;
  /** Solid silhouette drawn under the particles (a CSS color) so whatever is behind the canvas doesn't show through the gaps. */
  backing?: string;
  className?: string;
  onReady?: () => void;
};

const EMBER_POOL = 260;
const MAX_PARTICLES = 14000;
/** Stop spawning embers and let the loop sleep after this long without interaction. */
const IDLE_MS = 12000;

/** Resolves any CSS color string to RGB using a 1x1 canvas. */
function toRgb(color: string): [number, number, number] {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

const pack = (r: number, g: number, b: number, a = 255) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function ParticleCanvas({
  source,
  gap = 4,
  colorMode = "sample",
  embers = true,
  gamma = 1,
  backing,
  className,
  onReady,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const sourceKey = source.kind === "image" ? source.src : `${source.text}|${source.weight ?? 600}`;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // "still" = draw the assembled shape once, no animation loop.
    let still = reduceMotion || isMotionOff();
    let lastActive = performance.now();

    let W = 0;
    let H = 0;
    let dpr = 1;
    let g = 4;
    let size = 2;
    let count = 0;
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let rgb = new Uint8Array(0);
    let color = new Uint32Array(0);
    let edges: number[] = [];

    // Ember pool
    const ex = new Float32Array(EMBER_POOL);
    const ey = new Float32Array(EMBER_POOL);
    const evx = new Float32Array(EMBER_POOL);
    const evy = new Float32Array(EMBER_POOL);
    const life = new Float32Array(EMBER_POOL);
    const decay = new Float32Array(EMBER_POOL);
    let accent: [number, number, number] = [124, 116, 255];

    let image: ImageData | null = null;
    let silhouette: Uint32Array | null = null;
    let silhouetteAlpha: Uint8Array | null = null;
    let buf: Uint32Array | null = null;
    let raf = 0;
    let visible = true;
    let disposed = false;
    const pointer = { x: -1e5, y: -1e5, active: false };

    const readColors = () => {
      // --accent holds space-separated RGB channels.
      const channels = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      if (channels) accent = toRgb(`rgb(${channels.split(/\s+/).join(",")})`);
      if (colorMode === "current") {
        const [r, gg, b] = toRgb(getComputedStyle(canvas).color);
        for (let i = 0; i < count; i++) color[i] = pack(r, gg, b);
      } else {
        const lift = (v: number) => (gamma === 1 ? v : Math.round(255 * Math.pow(v / 255, gamma)));
        for (let i = 0; i < count; i++) color[i] = pack(lift(rgb[i * 3]), lift(rgb[i * 3 + 1]), lift(rgb[i * 3 + 2]));
      }
    };

    let img: HTMLImageElement | null = null;

    const build = async () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(rect.width * dpr);
      H = Math.round(rect.height * dpr);
      canvas.width = W;
      canvas.height = H;
      // Cap particle count on large/high-DPR screens (assumes ~55% of cells are filled).
      g = Math.max(2, Math.round(gap * dpr), Math.ceil(Math.sqrt((W * H * 0.55) / MAX_PARTICLES)));
      size = Math.max(1, Math.round(g * 0.66));

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d", { willReadFrequently: true })!;

      if (source.kind === "image") {
        if (!img) img = await loadImage(source.src);
        if (disposed) return;
        const scale = Math.min(W / img.width, H / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        octx.drawImage(img, (W - dw) / 2, H - dh, dw, dh);
      } else {
        await document.fonts?.ready;
        if (disposed) return;
        const family = getComputedStyle(wrap).fontFamily;
        const weight = source.weight ?? 600;
        // Tight tracking to match the display headings (-0.04em).
        const track = (px: number) => {
          octx.font = `${weight} ${px}px ${family}`;
          (octx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-px * 0.04}px`;
        };
        track(100);
        const measured = octx.measureText(source.text).width || 1;
        const fontSize = Math.min((100 * W * 0.98) / measured, H * 0.92);
        track(fontSize);
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillStyle = "#000";
        octx.fillText(source.text, W / 2, H / 2 + fontSize * 0.04);
      }

      const data = octx.getImageData(0, 0, W, H).data;
      if (backing) {
        silhouetteAlpha = new Uint8Array(W * H);
        for (let i = 0, j = 3; i < W * H; i++, j += 4) silhouetteAlpha[i] = data[j];
      } else {
        silhouetteAlpha = null;
      }
      const cols = Math.ceil(W / g);
      const rows = Math.ceil(H / g);
      const filled = new Uint8Array(cols * rows);
      const tmp: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = Math.min(W - 1, c * g + (g >> 1));
          const y = Math.min(H - 1, r * g + (g >> 1));
          const i = (y * W + x) * 4;
          if (data[i + 3] > 140) {
            filled[r * cols + c] = 1;
            tmp.push(x, y, data[i], data[i + 1], data[i + 2], r * cols + c);
          }
        }
      }

      count = tmp.length / 6;
      ox = new Float32Array(count);
      oy = new Float32Array(count);
      px = new Float32Array(count);
      py = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      rgb = new Uint8Array(count * 3);
      color = new Uint32Array(count);
      edges = [];
      for (let i = 0; i < count; i++) {
        const k = i * 6;
        ox[i] = tmp[k];
        oy[i] = tmp[k + 1];
        rgb[i * 3] = tmp[k + 2];
        rgb[i * 3 + 1] = tmp[k + 3];
        rgb[i * 3 + 2] = tmp[k + 4];
        const cell = tmp[k + 5];
        if (cell < cols || !filled[cell - cols]) edges.push(i);
        if (still) {
          px[i] = ox[i];
          py[i] = oy[i];
        } else {
          // Start scattered and assemble.
          const a = Math.random() * Math.PI * 2;
          const d = (0.35 + Math.random() * 0.65) * Math.max(W, H) * 0.6;
          px[i] = ox[i] + Math.cos(a) * d;
          py[i] = oy[i] + Math.sin(a) * d;
        }
      }
      life.fill(0);
      readColors();

      image = ctx.createImageData(W, H);
      buildSilhouette();
      buf = new Uint32Array(image.data.buffer);
      draw();
      onReadyRef.current?.();
      if (!still) start();
    };

    // Pre-rendered backing layer, copied into the frame buffer each frame (a memcpy).
    const buildSilhouette = () => {
      if (!backing || !silhouetteAlpha) {
        silhouette = null;
        return;
      }
      const [r, g, b] = toRgb(backing);
      silhouette = new Uint32Array(W * H);
      for (let i = 0; i < silhouette.length; i++) {
        const a = silhouetteAlpha[i];
        if (a > 8) silhouette[i] = pack(r, g, b, a);
      }
    };

    const spawnEmber = (j: number) => {
      if (!edges.length) return;
      const i = edges[(Math.random() * edges.length) | 0];
      ex[j] = px[i];
      ey[j] = py[i];
      evx[j] = (Math.random() - 0.3) * 0.5 * dpr;
      evy[j] = -(0.25 + Math.random() * 0.8) * dpr;
      life[j] = 1;
      decay[j] = 0.004 + Math.random() * 0.01;
    };

    const step = () => {
      const R = 90 * dpr;
      const R2 = R * R;
      const mx = pointer.x;
      const my = pointer.y;
      for (let i = 0; i < count; i++) {
        let x = px[i];
        let y = py[i];
        let ux = vx[i];
        let uy = vy[i];
        const dx = x - mx;
        const dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 2.6;
          ux += (dx / d) * f;
          uy += (dy / d) * f;
        }
        ux += (ox[i] - x) * 0.045;
        uy += (oy[i] - y) * 0.045;
        ux *= 0.86;
        uy *= 0.86;
        x += ux;
        y += uy;
        px[i] = x;
        py[i] = y;
        vx[i] = ux;
        vy[i] = uy;
      }

      if (embers) {
        const spawning = performance.now() - lastActive < IDLE_MS;
        for (let j = 0; j < EMBER_POOL; j++) {
          if (life[j] <= 0) {
            if (spawning && Math.random() < 0.035) spawnEmber(j);
            continue;
          }
          evx[j] += (Math.random() - 0.5) * 0.04 * dpr;
          ex[j] += evx[j];
          ey[j] += evy[j];
          life[j] -= decay[j];
        }
      }
    };

    const fillSquare = (b: Uint32Array, x: number, y: number, s: number, c: number) => {
      const x0 = x | 0;
      const y0 = y | 0;
      if (x0 < 0 || y0 < 0 || x0 + s > W || y0 + s > H) return;
      for (let yy = 0; yy < s; yy++) {
        const row = (y0 + yy) * W + x0;
        for (let xx = 0; xx < s; xx++) b[row + xx] = c;
      }
    };

    const draw = () => {
      if (!image || !buf) return;
      if (silhouette) buf.set(silhouette);
      else buf.fill(0);
      const half = size >> 1;
      for (let i = 0; i < count; i++) fillSquare(buf, px[i] - half, py[i] - half, size, color[i]);
      if (embers) {
        const es = Math.max(1, Math.round(size * 0.8));
        for (let j = 0; j < EMBER_POOL; j++) {
          if (life[j] <= 0) continue;
          fillSquare(buf, ex[j], ey[j], es, pack(accent[0], accent[1], accent[2], (life[j] * 230) | 0));
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    /** Idle, settled and no embers left: the loop can sleep until the next interaction. */
    const canSleep = () => {
      if (performance.now() - lastActive < IDLE_MS) return false;
      for (let j = 0; j < EMBER_POOL; j++) if (life[j] > 0) return false;
      for (let i = 0; i < count; i += 7) if (Math.abs(vx[i]) + Math.abs(vy[i]) > 0.05) return false;
      return true;
    };

    const loop = () => {
      raf = 0;
      if (!visible || document.hidden || disposed || still) return;
      step();
      draw();
      if (canSleep()) return;
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !still) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      lastActive = performance.now();
      start();
    };

    const settle = () => {
      for (let i = 0; i < count; i++) {
        px[i] = ox[i];
        py[i] = oy[i];
        vx[i] = vy[i] = 0;
      }
      life.fill(0);
      draw();
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < -60 || y < -60 || x > r.width + 60 || y > r.height + 60) {
        pointer.x = pointer.y = -1e5;
        return;
      }
      pointer.x = x * dpr;
      pointer.y = y * dpr;
      wake();
    };
    const onPointerLeave = () => {
      pointer.x = pointer.y = -1e5;
    };
    // A finger that lifts or starts scrolling shouldn't keep repelling particles.
    const onPointerEnd = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onPointerLeave();
    };
    // "click" (not pointerdown) so a scroll gesture that starts on the canvas doesn't burst it.
    const onBurst = (e: MouseEvent) => {
      if (still) return;
      lastActive = performance.now();
      const r = canvas.getBoundingClientRect();
      const bx = (e.clientX - r.left) * dpr;
      const by = (e.clientY - r.top) * dpr;
      for (let i = 0; i < count; i++) {
        const dx = px[i] - bx;
        const dy = py[i] - by;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = Math.max(0, 1 - d / (260 * dpr)) * 34;
        vx[i] += (dx / d) * f * (0.6 + Math.random() * 0.8);
        vy[i] += (dy / d) * f * (0.6 + Math.random() * 0.8);
      }
      start();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(wrap);

    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastWidth = 0;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w === lastWidth) return; // ignore height-only changes (mobile URL bar)
      lastWidth = w;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => void build(), 120);
    });
    ro.observe(wrap);

    const themeObserver = new MutationObserver(() => {
      readColors();
      if (still) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onVisibility = () => !document.hidden && wake();
    const offMotion = onMotionChange(() => {
      still = reduceMotion || isMotionOff();
      if (still) {
        cancelAnimationFrame(raf);
        raf = 0;
        settle();
      } else wake();
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);
    document.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onBurst);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      document.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onBurst);
      offMotion();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, gap, colorMode, embers, gamma, backing]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full touch-pan-y" />
    </div>
  );
}
