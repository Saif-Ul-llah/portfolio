"use client";

import { ScrollReveal } from "./scroll-reveal";

const techRows = [
  [
    { name: "TypeScript", color: "#3178C6" },
    { name: "Node.js", color: "#339933" },
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#ffffff" },
    { name: "AWS", color: "#FF9900" },
    { name: "PostgreSQL", color: "#4169E1" },
    { name: "Firebase", color: "#FFCA28" },
    { name: "Supabase", color: "#3FCF8E" },
    { name: "Laravel", color: "#FF2D20" },
    { name: "Docker", color: "#2496ED" },
  ],
  [
    { name: "Kubernetes", color: "#326CE5" },
    { name: "NGINX", color: "#009639" },
    { name: "MySQL", color: "#4479A1" },
    { name: "MongoDB", color: "#47A248" },
    { name: "Redis", color: "#DC382D" },
    { name: "Git", color: "#F05032" },
    { name: "Python", color: "#3776AB" },
    { name: "GraphQL", color: "#E10098" },
    { name: "Tailwind", color: "#06B6D4" },
    { name: "Flutter", color: "#02569B" },
  ],
];

function TechPill({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl glass whitespace-nowrap group hover:bg-white/10 transition-all cursor-default mx-2">
      <div
        className="w-3 h-3 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
      />
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
        {name}
      </span>
    </div>
  );
}

export function TechStack() {
  return (
    <section id="tech-stack" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-accent-cyan text-sm font-medium tracking-widest uppercase mb-4 block">
              Skills
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tech <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Technologies I work with to build scalable applications
            </p>
          </div>
        </ScrollReveal>

        {/* Marquee Row 1 */}
        <div className="marquee-container mb-4">
          <div className="flex animate-marquee" style={{ width: "fit-content" }}>
            {[...techRows[0], ...techRows[0]].map((tech, i) => (
              <TechPill key={`r1-${i}`} {...tech} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (reverse) */}
        <div className="marquee-container">
          <div className="flex animate-marquee-reverse" style={{ width: "fit-content" }}>
            {[...techRows[1], ...techRows[1]].map((tech, i) => (
              <TechPill key={`r2-${i}`} {...tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
