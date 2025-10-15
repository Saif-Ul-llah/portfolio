"use client";

import { HeroSection } from '@/components/hero-section';
import { ProjectsSection } from '@/components/projects-section';
import { ExperienceSection } from '@/components/experience-section';
import { TechStack } from '@/components/tech-stack';
import { ContactSection } from '@/components/contact-section';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProjectsSection />
      <ExperienceSection />
      <TechStack />
      <ContactSection />
    </main>
  );
}