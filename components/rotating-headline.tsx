"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMotionAllowed } from "@/lib/motion";

/** Each set is one full headline; lines swap together in a staggered wave. */
const sets = [
  ["Backends", "Products", "AI"],
  ["APIs", "Features", "Real-time"],
  ["Systems", "MVPs", "Billing"],
  ["Databases", "Releases", "Search"],
];
const endings = ["that hold.", "that ship.", "that works."];
const INTERVAL = 3200;

/**
 * A word slot: the outgoing word's letters rise and blur out while the incoming
 * word's letters rise in behind them. The slot width eases between word widths.
 */
function WordSlot({ word, lineDelay, className = "" }: { word: string; lineDelay: number; className?: string }) {
  const [current, setCurrent] = useState(word);
  const [previous, setPrevious] = useState<string | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (word === current) return;
    const t = setTimeout(() => {
      setPrevious(current);
      setCurrent(word);
    }, lineDelay);
    return () => clearTimeout(t);
  }, [word, current, lineDelay]);

  useLayoutEffect(() => {
    if (measureRef.current) setWidth(measureRef.current.offsetWidth);
  }, [current]);

  // Re-measure when fonts load or the headline resizes (it is sized in cqw).
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [current]);

  return (
    <span
      className={`relative inline-block whitespace-nowrap align-bottom transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${className}`}
      style={{ width }}
    >
      {previous && (
        <span key={`out-${previous}-${current}`} className="absolute left-0 top-0 whitespace-nowrap" aria-hidden="true">
          {[...previous].map((ch, i) => (
            <span key={i} className="headline-char-out inline-block" style={{ animationDelay: `${i * 22}ms` }}>
              {ch}
            </span>
          ))}
        </span>
      )}
      {/* Measured directly: split letters lay out wider than the same word as plain text */}
      <span key={`in-${current}`} ref={measureRef} className="inline-block whitespace-nowrap">
        {[...current].map((ch, i) => (
          <span
            key={i}
            className={previous ? "headline-char-in inline-block" : "inline-block"}
            style={{ animationDelay: `${120 + i * 28}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export function RotatingHeadline({ className = "", as: Tag = "h1" }: { className?: string; as?: "h1" | "h2" | "p" }) {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const allowed = useMotionAllowed();

  // Rotates only while motion is allowed, the tab is visible and the reader isn't hovering it.
  useEffect(() => {
    if (!allowed || hidden || hovered) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % sets.length), INTERVAL);
    return () => clearInterval(id);
  }, [allowed, hidden, hovered]);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  const words = sets[index];

  return (
    <Tag className={className} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span className="sr-only">Backends that hold. Products that ship. AI that works.</span>
      <span aria-hidden="true" className="block">
        {endings.map((ending, line) => {
          const accent = line === 2;
          return (
            <span
              key={line}
              className={`headline-line block ${accent ? "accent-word text-[1.08em]" : ""}`}
              style={{ animationDelay: `${150 + line * 120}ms` }}
            >
              <WordSlot word={words[line]} lineDelay={line * 140} />{" "}
              <span className="whitespace-nowrap">{ending}</span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
