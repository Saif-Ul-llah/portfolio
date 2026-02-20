"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Dot follows instantly
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };

    // Smooth ring follow with requestAnimationFrame
    let raf: number;
    const animateRing = () => {
      const dx = mouse.current.x - ring.current.x;
      const dy = mouse.current.y - ring.current.y;
      ring.current.x += dx * 0.15;
      ring.current.y += dy * 0.15;

      const size = hovering.current ? 50 : 36;
      const offset = size / 2;
      ringEl.style.transform = `translate(${ring.current.x - offset}px, ${ring.current.y - offset}px)`;

      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    // Detect hovering over interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, [role='button']")) {
        hovering.current = true;
        document.body.classList.add("cursor-hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, [role='button']")) {
        hovering.current = false;
        document.body.classList.remove("cursor-hover");
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    const onEnter = () => {
      dot.style.opacity = "1";
      ringEl.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
