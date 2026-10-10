"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { ParticleCanvas } from "./particle-canvas";
import { RotatingHeadline } from "./rotating-headline";
import { profile } from "@/lib/data";
import { useMotionAllowed } from "@/lib/motion";

const NAME = "SAIF-UL-LLAH";

/**
 * Minimal cinematic first screen: a giant name behind the particle portrait,
 * one headline bottom-left and one call to action bottom-right.
 * Always dark, in both themes.
 */
export function Hero({ company }: { company?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const motion = useMotionAllowed();

  // Subtle mouse parallax: write -1..1 offsets to CSS variables (no re-render per move).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !motion || matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 2 - 1;
      y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--mx", x.toFixed(3));
          el.style.setProperty("--my", y.toFixed(3));
        });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
  }, [motion]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="on-dark relative isolate overflow-hidden bg-bg text-ink"
      aria-label="Introduction"
    >
      {/* Backdrop: one soft glow and film grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_10%,rgb(var(--accent)/0.2),transparent_65%)]" />
        <div className="hero-grain absolute inset-0" />
      </div>

      <div className="relative h-[80svh] min-h-[540px] lg:h-[100svh] lg:min-h-[680px]">
        {/* Giant name, behind the portrait */}
        <h1 className="hero-exit-name absolute inset-x-0 top-[17%] z-0 sm:top-[16%] lg:top-[15%]">
          <span className="sr-only">Saif-Ul-llah, full-stack engineer</span>
          <span
            aria-hidden="true"
            className="hero-parallax-back block whitespace-nowrap text-center font-display uppercase leading-[0.84] tracking-[-0.01em] text-[26vw] sm:text-[clamp(3.5rem,13.4vw,16.5rem)] sm:leading-[0.8]"
          >
            {[...NAME].map((ch, i) => (
              <span key={i}>
                <span
                  // The hyphen at the phone line break is dropped so "SAIF" centres.
                  className={`hero-name-char ${i === 4 ? "max-sm:!hidden" : ""}`}
                  style={{ animationDelay: `${120 + i * 55}ms` }}
                >
                  {ch}
                </span>
                {i === 4 && <br className="sm:hidden" />}
              </span>
            ))}
          </span>
        </h1>

        {/* Portrait (outer box centres; inner layers own the exit and parallax transforms) */}
        <div className="absolute bottom-0 left-1/2 z-10 aspect-[900/1039] h-[66%] -translate-x-1/2 sm:h-[74%] lg:h-[82%]">
          <div className="hero-exit-portrait h-full w-full origin-bottom">
            <div className="hero-parallax-front relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.cutout}
                alt="Portrait of Saif-Ul-llah"
                width={900}
                height={1039}
                fetchPriority="high"
                className={`absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-700 motion-reduce:opacity-100 ${
                  ready ? "opacity-0" : "opacity-100"
                }`}
              />
              <ParticleCanvas
                source={{ kind: "image", src: profile.cutout }}
                gap={3}
                gamma={0.62}
                backing="#0a0a0d"
                onReady={() => setReady(true)}
                className="absolute inset-0 cursor-crosshair motion-reduce:hidden"
              />
            </div>
          </div>
        </div>

        {/* Fade the lower portrait into the background so the copy stays readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-[50%] bg-gradient-to-t from-bg from-15% via-bg/85 to-transparent"
        />

        {/* Scroll cue */}
        <a
          href="#about"
          aria-label="Scroll to about"
          className="absolute bottom-8 left-1/2 z-30 hidden h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink lg:grid"
        >
          <ArrowDown size={16} className="motion-safe:animate-bounce" />
        </a>
      </div>

      {/* Copy: below the portrait on phones, in the bottom corners on desktop */}
      <div className="page-x relative z-30 pb-14 pt-6 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-10 lg:pt-0">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="[container-type:inline-size] lg:pointer-events-auto lg:col-span-4">
            <p className="hero-in flex items-center gap-2 font-mono text-xs text-muted" style={{ animationDelay: "500ms" }}>
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ok" />
              Available for work
            </p>
            <RotatingHeadline as="h2" className="display mt-4 text-[clamp(2rem,10.5cqw,3.2rem)]" />
          </div>

          <div className="lg:pointer-events-auto lg:col-span-4 lg:col-start-9 lg:text-right">
            <p className="hero-in text-base leading-relaxed text-muted" style={{ animationDelay: "650ms" }}>
              Full-stack engineer in Karachi.
              {company && (
                <span className="block">
                  Currently at <span className="whitespace-nowrap text-ink">{company}</span>
                </span>
              )}
            </p>
            <div
              className="hero-in mt-5 flex flex-wrap items-center gap-3 lg:justify-end"
              style={{ animationDelay: "750ms" }}
            >
              <a href="#contact" className="btn-primary h-12 rounded-full px-6">
                Start a project <ArrowUpRight size={16} />
              </a>
              <a href="#experience" className="btn group h-12 rounded-full px-4 text-ink">
                See my experience
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
