"use client";

import { useEffect, useRef } from "react";
import { toBullets, type Experience } from "@/lib/data";

export function Journey({ experiences }: { experiences: Experience[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // The timeline rail fills as the reader scrolls through it.
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="experience" className="on-dark border-y border-line bg-bg py-24 text-ink sm:py-32">
      <div className="page-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow reveal">Experience</p>
            <h2 className="display reveal mt-4 text-4xl sm:text-6xl">
              The <span className="accent-word">journey</span> so far.
            </h2>
            <p className="reveal mt-6 max-w-sm leading-relaxed text-muted">
              From React dashboards to leading backends: {experiences.length} teams, each one closer to the
              systems underneath the product.
            </p>
          </div>
        </div>

        <ol ref={listRef} className="relative space-y-6 lg:col-span-8">
          {/* Scroll-filled rail */}
          <div className="absolute bottom-6 left-[7px] top-6 w-px bg-line" aria-hidden="true">
            <div ref={fillRef} className="h-full w-full origin-top scale-y-0 bg-accent" />
          </div>

          {experiences.map((exp, i) => {
            const current = /present/i.test(exp.period);
            return (
              <li key={exp._id} className="reveal group/role relative pl-8 sm:pl-10">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-8 h-[15px] w-[15px] rounded-full border-2 ${
                    current ? "border-accent bg-accent shadow-[0_0_14px_rgb(var(--accent))]" : "border-line bg-bg"
                  }`}
                />
                <article className="glass glow-hover relative overflow-hidden p-6 sm:p-8 md:grid md:grid-cols-[minmax(0,13rem)_1fr] md:gap-8">
                  {/* Accent bar draws down when the card is revealed */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform delay-200 duration-700 group-[.is-visible]/role:scale-y-100 motion-reduce:scale-y-100 ${
                      current ? "bg-accent" : "bg-accent/40"
                    }`}
                  />
                  <div>
                    <p className="font-mono text-xs text-muted">{exp.period}</p>
                    <p className="mt-3 text-xl font-semibold tracking-tight">{exp.company}</p>
                    <p className="mt-1 text-sm text-muted">{exp.location.replace(/,(\S)/, ", $1")}</p>
                    {current && (
                      <span className="mt-3 inline-block rounded-full border border-accent/50 px-2.5 py-0.5 font-mono text-[11px] text-accent">
                        Current role
                      </span>
                    )}
                  </div>
                  <div className="mt-6 md:mt-0">
                    <h3 className="text-2xl font-semibold tracking-tight">{exp.role}</h3>
                    <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink/85">
                      {toBullets(exp.description).map((b, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="mt-[0.6em] h-1 w-1 shrink-0 rotate-45 bg-accent" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {!!exp.responsibilities?.length && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {exp.responsibilities.map((r) => (
                          <span key={r} className="chip">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="sr-only">
                    Role {experiences.length - i} of {experiences.length}
                  </span>
                </article>
              </li>
            );
          })}

        </ol>
      </div>
    </section>
  );
}
