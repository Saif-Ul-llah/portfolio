"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function toggleTheme() {
  const dark = !document.documentElement.classList.contains("dark");
  const apply = () => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };
  // View Transitions give a smooth cross-fade where supported.
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (doc.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    doc.startViewTransition(apply);
  } else {
    apply();
  }
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Mirror the <html class="dark"> state so the button can announce it.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="dark:hidden" />
    </button>
  );
}
