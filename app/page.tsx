import { getExperiences, getProjects } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { CommandPalette } from "@/components/command-palette";
import { RevealObserver } from "@/components/reveal-observer";
import { Hero } from "@/components/hero";
import { SignalStrip } from "@/components/signal-strip";
import { Stats } from "@/components/stats";
import { About } from "@/components/about";
import { Journey } from "@/components/journey";
import { Stack } from "@/components/stack";
import { Process } from "@/components/process";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

// Re-fetch projects and experience from the API at most once an hour.
export const revalidate = 3600;

/** Whole years since the first role (Jun 2023). */
function yearsShipping() {
  const start = new Date(2023, 5, 1);
  return Math.floor((Date.now() - start.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export default async function Home() {
  const [projects, experiences] = await Promise.all([getProjects(), getExperiences()]);
  const current = experiences.find((e) => /present/i.test(e.period));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <SiteHeader />
      <CommandPalette />
      <RevealObserver />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero company={current?.company} />
        <SignalStrip />
        <Stats
          stats={[
            { value: yearsShipping(), suffix: "+", label: "years shipping production software" },
            { value: projects.length || 9, suffix: "", label: "products shipped to production" },
            { value: experiences.length, suffix: "", label: "engineering teams, from startups to agencies" },
          ]}
        />
        <About />
        <Journey experiences={experiences} />
        <Stack />
        <Process />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
