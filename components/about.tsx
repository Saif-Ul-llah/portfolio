import { ArrowUpRight } from "lucide-react";
import { capabilities, profile } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="page-x py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow reveal">About</p>
          <h2 className="display reveal mt-4 text-4xl sm:text-6xl">
            I build the part
            <br />
            users <span className="accent-word">never see</span>
            <br />
            and the part they do.
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-6 lg:col-start-7 lg:pt-10">
          <p className="reveal">
            Three years ago I started in React, building dashboards for a sports platform. Since then my
            work has moved down the stack: API design, data models, queues, sockets and the deploys that
            keep them running. Today I lead backends and ship the front ends on top of them.
          </p>
          <p className="reveal">
            I care about the boring parts that decide whether a product survives: access control that
            can&apos;t be bypassed, payments that reconcile, real-time features that recover from a dropped
            connection, and AI features with limits and fallbacks instead of demos.
          </p>
          <a
            href={profile.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal link-underline inline-flex items-center gap-2 pt-2 text-base font-medium text-ink"
          >
            Read my résumé <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <ul className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c, i) => (
          <li
            key={c.title}
            className="glass glow-hover reveal group relative flex flex-col overflow-hidden p-6 sm:p-8"
            style={{ transitionDelay: `${i * 70}ms` }}
          >
            <span className="font-mono text-xs text-muted">0{i + 1}</span>
            <h3 className="mt-8 text-xl font-semibold tracking-tight">{c.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
          </li>
        ))}
      </ul>
    </section>
  );
}
