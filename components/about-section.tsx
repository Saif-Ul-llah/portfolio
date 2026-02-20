"use client";

import Image from "next/image";
import { Download, Code2, Server, Database, Layers, GitBranch, Container, Globe, Shield } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const skills = [
  { icon: Code2, title: "Front-End Development", desc: "Building responsive, accessible, and performant UIs with React & Next.js." },
  { icon: Server, title: "Back-End Engineering", desc: "Developing scalable APIs & services with Node.js and Express." },
  { icon: Database, title: "Database Design", desc: "Designing optimized schemas in MongoDB, SQL, and Postgres." },
  { icon: Layers, title: "Full-Stack Integration", desc: "Seamlessly connecting front-end & back-end for smooth user experiences." },
  { icon: GitBranch, title: "DevOps & Deployment", desc: "CI/CD pipelines, monitoring, and infrastructure optimization." },
  { icon: Container, title: "Docker & Containers", desc: "Packaging applications into containers for consistency & scalability." },
  { icon: Globe, title: "Web Servers", desc: "Configuring Nginx & Apache for secure, high-performance delivery." },
  { icon: Shield, title: "VPS Management", desc: "Deploying & managing VPS with strong security and uptime practices." },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-accent-cyan text-sm font-medium tracking-widest uppercase mb-4 block">
              About
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              I am a MERN Stack Developer passionate about designing scalable web applications that
              blend performance with elegant design. With 3+ years of professional experience, I focus
              on creating solutions that are both technically robust and user-friendly.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Photo */}
          <ScrollReveal direction="left">
            <div className="relative group">
              <div className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden glass-card">
                <Image
                  src="https://res.cloudinary.com/saif-ul-llah/image/upload/v1755721817/k6rvr6qr9heyzh6pbujw.png"
                  alt="Saif-ul-llah"
                  fill
                  className="object-cover"
                />
                {/* Overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark via-dark/80 to-transparent">
                  <h3 className="text-lg font-bold">Saif-ul-llah</h3>
                  <p className="text-gray-400 text-sm">MERN Stack Developer</p>
                </div>
              </div>

              {/* Download Resume */}
              <div className="flex justify-center mt-6">
                <a
                  href="https://drive.google.com/uc?export=download&id=1ufyJdFXz_R1eT3D6CguNvhX6OjWCx5x-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow px-6 py-3 rounded-xl glass text-white font-medium inline-flex items-center gap-2 relative z-10"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Skills */}
          <ScrollReveal direction="right">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Turning ideas into impactful{" "}
                <span className="gradient-text">digital experiences</span>
              </h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                I specialize in crafting end-to-end web solutions — from pixel-perfect interfaces to optimized
                back-end architectures. My goal is to deliver applications that not only work flawlessly but
                also delight users.
              </p>

              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <ScrollReveal key={skill.title} delay={index * 80}>
                    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-accent-purple/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-purple/20 transition-colors">
                        <skill.icon size={18} className="text-accent-cyan" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold mb-0.5">{skill.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{skill.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
