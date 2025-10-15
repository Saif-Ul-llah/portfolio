"use client";

export function TechStack() {
  const technologies = [
    { name: "TypeScript", icon: "TS" },
    { name: "Supabase", icon: "SB" },
    { name: "Firebase", icon: "FB" },
    { name: "Node.js", icon: "NODE" },
    { name: "AWS", icon: "AWS" },
    { name: "PostgreSQL", icon: "PG" },
    { name: "Laravel", icon: "LV" },
    { name: "NGINX", icon: "NX" },
    { name: "MySQL", icon: "SQL" },
    { name: "Kubernetes", icon: "K8s" },
  ];

  return (
    <section id="tech-stack" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">TECH STACKS</h2>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center justify-center p-4 bg-gray-900/30 rounded-lg border border-gray-800 hover:border-purple-500 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold text-purple-300">{tech.icon}</span>
              </div>
              <span className="text-xs text-gray-400 text-center">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
