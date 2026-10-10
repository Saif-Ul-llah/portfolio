"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Copy,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Pause,
  Search,
  SunMoon,
  type LucideIcon,
} from "lucide-react";
import { profile } from "@/lib/data";
import { toggleTheme } from "./theme-toggle";
import { openChat } from "@/lib/chat";
import { toggleMotion } from "@/lib/motion";

const OPEN_EVENT = "open-command-palette";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Item = {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  hint?: string;
  run: () => void | Promise<void>;
};

const go = (hash: string) => () => {
  document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", hash);
};
const open = (url: string) => () => void window.open(url, "_blank", "noopener,noreferrer");

export function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");

  const items: Item[] = useMemo(
    () => [
      { id: "chat", label: "Ask my AI assistant", group: "Assistant", icon: MessageCircle, run: openChat },
      { id: "about", label: "About", group: "Navigate", icon: ArrowRight, run: go("#about") },
      { id: "exp", label: "Experience", group: "Navigate", icon: ArrowRight, run: go("#experience") },
      { id: "stack", label: "Tech stack", group: "Navigate", icon: ArrowRight, run: go("#stack") },
      { id: "process", label: "How I work", group: "Navigate", icon: ArrowRight, run: go("#process") },
      { id: "contact", label: "Contact", group: "Navigate", icon: ArrowRight, run: go("#contact") },
      {
        id: "copy",
        label: "Copy email address",
        group: "Actions",
        icon: Copy,
        hint: profile.email,
        run: async () => {
          await navigator.clipboard.writeText(profile.email);
          setToast("Email copied");
        },
      },
      { id: "mail", label: "Send an email", group: "Actions", icon: Mail, run: () => void (location.href = `mailto:${profile.email}`) },
      { id: "theme", label: "Toggle light / dark", group: "Actions", icon: SunMoon, run: toggleTheme },
      { id: "motion", label: "Pause / play animations", group: "Actions", icon: Pause, run: toggleMotion },
      { id: "cv", label: "Open résumé", group: "Links", icon: FileText, run: open(profile.cv) },
      { id: "gh", label: "GitHub", group: "Links", icon: Github, run: open(profile.github) },
      { id: "li", label: "LinkedIn", group: "Links", icon: Linkedin, run: open(profile.linkedin) },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.group}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    const show = () => {
      const d = dialogRef.current;
      if (!d || d.open) return;
      setQuery("");
      setIndex(0);
      d.showModal();
      inputRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) dialogRef.current.close();
        else show();
      }
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const runItem = async (item: Item) => {
    dialogRef.current?.close();
    await item.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter" && filtered[index]) {
      e.preventDefault();
      void runItem(filtered[index]);
    }
  };

  let lastGroup = "";

  return (
    <>
      <dialog
        ref={dialogRef}
        aria-label="Command menu"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="mt-[12vh] w-[min(560px,calc(100vw-32px))] overflow-hidden rounded-xl border border-line bg-bg p-0 text-ink shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <ul id="cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No results</li>}
          {filtered.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id} role="presentation">
                {header && <div className="eyebrow px-3 pb-1 pt-3 text-[10px]">{header}</div>}
                <button
                  id={`cmd-${item.id}`}
                  role="option"
                  aria-selected={i === index}
                  type="button"
                  onMouseMove={() => setIndex(i)}
                  onClick={() => void runItem(item)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm ${
                    i === index ? "bg-surface text-ink" : "text-muted"
                  }`}
                >
                  <item.icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.hint && <span className="font-mono text-[11px] text-muted">{item.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[10px] text-muted">
          <span>↑↓ to navigate · ↵ to select</span>
          <span>Ctrl/⌘ K</span>
        </div>
      </dialog>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-bg shadow-lg transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        {toast}
      </div>
    </>
  );
}
