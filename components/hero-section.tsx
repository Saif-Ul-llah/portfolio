"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Download, ArrowDown } from "lucide-react";

const roles = [
  "Full Stack Developer",
  "Mobile App Developer",
  "Backend Engineer",
  "Problem Solver",
];

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timeout = setTimeout(
        () => {
          setText(
            isDeleting
              ? currentRole.slice(0, text.length - 1)
              : currentRole.slice(0, text.length + 1)
          );
        },
        isDeleting ? 40 : 80
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Floating Orbs */}
      <div className="orb orb-1 animate-float" />
      <div className="orb orb-2 animate-float-delayed" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-300 mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-green-500 rounded-full status-pulse" />
          Available for work
        </div>

        {/* Main Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text">Saif-Ul-llah</span>
        </h1>

        {/* Typewriter Role */}
        <div
          className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-300 mb-6 h-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span>{text}</span>
          <span className="typewriter-cursor" />
        </div>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          I build end-to-end mobile and backend applications, turning complex
          problems into elegant, scalable solutions.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#projects")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-glow px-8 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-medium relative z-10"
          >
            View Projects
          </a>
          <a
            href="https://drive.google.com/uc?export=download&id=1ufyJdFXz_R1eT3D6CguNvhX6OjWCx5x-"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow px-8 py-3 rounded-xl glass text-white font-medium inline-flex items-center gap-2 relative z-10"
          >
            <Download size={18} />
            Download CV
          </a>
        </div>

        {/* Social Links */}
        <div
          className="flex items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href="https://github.com/Saif-Ul-llah/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/saif-hammad-952a94219"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:saifhammad411@gmail.com"
            className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Mail size={20} />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-500">
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
}
