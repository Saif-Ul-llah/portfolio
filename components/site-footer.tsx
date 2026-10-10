import { ArrowUp } from "lucide-react";
import { ParticleCanvas } from "./particle-canvas";
import { MotionToggle } from "./motion-toggle";
import { profile } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden pt-16">
      <div className="page-x">
        <div className="flex flex-col gap-8 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-sm text-lg leading-snug">
            Independent thinking, production habits.
            <br />
            <span className="text-muted">Building from Karachi for teams anywhere.</span>
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ink">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ink">
              LinkedIn
            </a>
            <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ink">
              Résumé
            </a>
            <a href={`mailto:${profile.email}`} className="link-underline hover:text-ink">
              Email
            </a>
          </nav>
        </div>

        {/* Particle wordmark; the sr-only text keeps the name available to assistive tech */}
        <div className="relative py-6">
          <p className="sr-only">Saif-Ul-llah</p>
          <ParticleCanvas
            source={{ kind: "text", text: "Saif-Ul-llah", weight: 700 }}
            gap={2.5}
            colorMode="current"
            className="aspect-[5/1] w-full font-sans text-ink"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line py-6 font-mono text-xs text-muted">
          <span>© {new Date().getFullYear()} {profile.fullName}</span>
          <span className="hidden sm:inline">Built with Next.js · Canvas particles · No templates</span>
          <MotionToggle className="-mx-2" />
          <a href="#top" className="inline-flex items-center gap-1 hover:text-ink">
            Back to top <ArrowUp size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
