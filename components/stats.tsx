"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; label: string };

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="At a glance" className="page-x pt-16">
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass glow-hover reveal relative flex flex-col-reverse justify-end overflow-hidden p-7 sm:p-8"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            {/* Corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-accent/25 blur-3xl"
            />
            <dt className="relative mt-3 max-w-[24ch] text-sm text-muted">{s.label}</dt>
            <dd className="display relative text-5xl sm:text-6xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
