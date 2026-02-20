"use client";

import { CustomCursor } from "@/components/custom-cursor";
import { Navbar } from "@/components/navbar";
import { ParticlesBg } from "@/components/particles-bg";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { TechStack } from "@/components/tech-stack";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ParticlesBg />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <div className="section-divider" />
        <AboutSection />
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
