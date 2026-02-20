"use client";

import { Navbar } from "@/components/navbar";
import { ParticlesBg } from "@/components/particles-bg";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { TechStack } from "@/components/tech-stack";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <ParticlesBg />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <ExperienceSection />
        <div className="section-divider" />
        <TechStack />
        <div className="section-divider" />
        <ContactSection />
      </main>
    </>
  );
}
