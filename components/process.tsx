import { processSteps } from "@/lib/data";

export function Process() {
  return (
    <section id="process" className="border-t border-line bg-surface/60 py-24 sm:py-32">
      <div className="page-x">
        <div className="max-w-2xl">
          <p className="eyebrow reveal">How I work</p>
          <h2 className="display reveal mt-4 text-4xl sm:text-6xl">
            Four steps. <span className="accent-word">No surprises.</span>
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Rail with a travelling signal */}
          <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-line md:block" aria-hidden="true">
            <span className="absolute top-1/2 h-1.5 w-10 -translate-y-1/2 animate-travel rounded-full bg-accent shadow-[0_0_12px_rgb(var(--accent))] motion-reduce:hidden" />
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {processSteps.map((s, i) => (
              <li key={s.n} className="reveal relative" style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="relative z-10 block h-[15px] w-[15px] rounded-full border-2 border-ink bg-bg" />
                <p className="mt-6 font-mono text-xs text-muted">{s.n}</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
