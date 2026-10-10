"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { openCommandPalette } from "./command-palette";

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

/**
 * Floating capsule header. It narrows once the page scrolls, and a pill slides
 * behind the hovered or active nav link.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const progressRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Written directly to avoid re-rendering the header on every scroll frame.
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const id of [...navLinks.map((l) => l.href), "#top", "#contact"]) {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const movePill = useCallback(() => {
    const target = hovered ?? active;
    const el = target ? linkRefs.current[target] : null;
    if (!el) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  }, [hovered, active]);

  useLayoutEffect(movePill, [movePill, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", movePill);
    return () => window.removeEventListener("resize", movePill);
  }, [movePill]);

  // Mobile menu: lock scroll, close on Escape, and keep Tab focus inside the header.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const header = headerRef.current;
    header?.querySelector<HTMLElement>("#mobile-menu a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !header) return;
      const items = [...header.querySelectorAll<HTMLElement>("a[href], button")].filter((el) => el.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    // Over the always-dark hero, use the dark token set so text stays readable in light mode.
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 ${!scrolled && !open ? "on-dark text-ink" : ""}`}
    >
      {/* Tap outside the mobile menu to close it */}
      {open && (
        <div aria-hidden="true" className="fixed inset-0 -z-10 bg-black/30 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} />
      )}
      <div
        className={`relative mx-auto flex h-14 items-center justify-between gap-3 rounded-full border px-2 transition-[max-width,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:h-16 ${
          scrolled || open
            ? "max-w-[62rem] border-line bg-bg/85 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
            : "max-w-[73rem] border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-3 rounded-full pr-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-mono text-[13px] font-semibold text-bg transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:bg-accent group-hover:text-accent-ink sm:h-11 sm:w-11">
            su/
          </span>
          {/* Name is screen-reader-only on phones so the link always has an accessible name */}
          <span
            className={`sr-only overflow-hidden whitespace-nowrap leading-tight transition-all duration-500 sm:not-sr-only sm:block ${
              scrolled ? "sm:max-w-0 sm:opacity-0" : "sm:max-w-[12rem] sm:opacity-100"
            }`}
          >
            <span className="block text-[15px] font-semibold tracking-tight">Saif-Ul-llah</span>
            <span className="block text-xs text-muted">Full-stack engineer</span>
          </span>
        </a>

        <nav
          ref={navRef}
          aria-label="Primary"
          onMouseLeave={() => setHovered(null)}
          className="relative hidden items-center lg:flex"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 rounded-full bg-surface transition-[left,width,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
          />
          {navLinks.map((l) => (
            <a
              key={l.href}
              ref={(el) => {
                linkRefs.current[l.href] = el;
              }}
              href={l.href}
              onMouseEnter={() => setHovered(l.href)}
              onFocus={() => setHovered(l.href)}
              onBlur={() => setHovered(null)}
              aria-current={active === l.href ? "true" : undefined}
              className={`relative z-10 rounded-full px-4 py-2 text-sm transition-colors ${
                active === l.href || hovered === l.href ? "text-ink" : "text-muted"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden h-10 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-xs text-muted transition-colors hover:border-ink hover:text-ink md:flex"
            aria-label="Open command menu"
          >
            <Command size={13} />K
          </button>
          <ThemeToggle />
          <a
            href="#contact"
            aria-current={active === "#contact" ? "true" : undefined}
            className={`btn-primary ml-1 hidden h-10 min-h-0 rounded-full sm:inline-flex sm:h-11 ${
              active === "#contact" ? "bg-accent text-accent-ink" : ""
            }`}
          >
            Let&apos;s talk <ArrowUpRight size={16} />
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Scroll progress, inset so it clears the rounded ends */}
        <div className="pointer-events-none absolute inset-x-8 -bottom-px h-px overflow-hidden" aria-hidden="true">
          <div ref={progressRef} className={`h-full origin-left scale-x-0 bg-accent ${scrolled ? "opacity-100" : "opacity-0"}`} />
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[62rem] overflow-y-auto rounded-3xl border border-line bg-bg/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
        >
          <ul>
            {[...navLinks, { label: "Contact", href: "#contact" }].map((l, i) => (
              <li key={l.href} className="headline-line" style={{ animationDelay: `${i * 40}ms` }}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline justify-between rounded-2xl px-4 py-4 text-2xl font-semibold tracking-tight transition-colors hover:bg-surface ${
                    active === l.href ? "bg-surface" : ""
                  }`}
                >
                  {l.label}
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2 border-t border-line p-2 pt-4">
            <a href="#contact" onClick={() => setOpen(false)} className="btn-primary flex-1 rounded-full">
              Let&apos;s talk <ArrowUpRight size={16} />
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCommandPalette();
              }}
              className="btn-ghost rounded-full font-mono text-xs"
              aria-label="Search and commands"
            >
              <Command size={13} />K
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
