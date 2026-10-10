"use client";

import { useMemo, useState } from "react";
import { Cloud, Database, Layers, Mic, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { TechConstellation } from "./tech-constellation";
import { isDarkBrand, toolCategories, tools, type Tool, type ToolCategory } from "@/lib/tools";

const glyphs: Record<NonNullable<Tool["glyph"]>, LucideIcon> = {
  cloud: Cloud,
  database: Database,
  sparkles: Sparkles,
  queue: Workflow,
  store: Layers,
  mic: Mic,
};

function ToolIcon({ tool }: { tool: Tool }) {
  if (tool.icon) {
    const color = isDarkBrand(tool.icon.hex) ? "currentColor" : `#${tool.icon.hex}`;
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0" fill={color}>
        <path d={tool.icon.path} />
      </svg>
    );
  }
  const Glyph = glyphs[tool.glyph ?? "sparkles"];
  return <Glyph size={20} aria-hidden="true" className="shrink-0 text-accent" />;
}

export function Stack() {
  const [category, setCategory] = useState<ToolCategory | "All">("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const names = useMemo(() => tools.map((t) => t.name), []);

  // The constellation lights up the hovered tile, or the selected category.
  const highlight = useMemo(() => {
    if (hovered) return new Set([hovered]);
    if (category === "All") return new Set<string>();
    return new Set(tools.filter((t) => t.category === category).map((t) => t.name));
  }, [hovered, category]);

  return (
    <section id="stack" className="page-x py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow reveal">Stack</p>
            <h2 className="display reveal mt-4 text-4xl sm:text-5xl">
              Tools I <span className="accent-word">reach for</span> daily.
            </h2>
            <p className="reveal mt-6 max-w-sm leading-relaxed text-muted">
              TypeScript end to end, chosen per problem rather than per trend. {tools.length} tools in production use.
            </p>
            <div className="reveal relative mx-auto mt-4 max-w-[400px]">
              <div aria-hidden="true" className="absolute inset-[15%] rounded-full bg-accent/15 blur-3xl" />
              <TechConstellation names={names} highlight={highlight} className="relative" />
              <p className="text-center font-mono text-[11px] text-muted motion-reduce:hidden">
                ↻ Drag to rotate · hover a tool to find it
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div role="group" aria-label="Filter tools" className="reveal flex flex-wrap gap-2">
            {(["All", ...toolCategories] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors ${
                  category === c ? "border-ink bg-ink text-bg" : "border-line text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" onMouseLeave={() => setHovered(null)}>
            {tools.map((t) => {
              const inCategory = category === "All" || t.category === category;
              return (
                <li key={t.name}>
                  <div
                    tabIndex={0}
                    onMouseEnter={() => setHovered(t.name)}
                    onFocus={() => setHovered(t.name)}
                    onBlur={() => setHovered(null)}
                    className={`glass glow-hover flex h-14 items-center gap-3 px-4 text-sm outline-none transition-opacity duration-300 focus-visible:border-accent ${
                      inCategory ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <ToolIcon tool={t} />
                    <span className="truncate">{t.name}</span>
                    <span className="sr-only">, {t.category}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
