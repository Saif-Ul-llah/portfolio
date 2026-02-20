"use client";

import { useEffect, useState } from "react";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

type Experience = {
  _id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
};

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experiences`);
        const data = await res.json();
        setExperiences(data.reverse());
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-gray-500">Loading experiences...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-accent-cyan text-sm font-medium tracking-widest uppercase mb-4 block">
              Career
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              My professional journey and the impact I&apos;ve made
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="timeline-line hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <ScrollReveal
                  key={exp._id}
                  direction={isLeft ? "left" : "right"}
                  delay={index * 150}
                >
                  <div
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Card */}
                    <div className="w-full md:w-[calc(50%-32px)] glass-card rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase size={18} className="text-accent-purple" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{exp.role}</h3>
                          <p className="text-accent-cyan text-sm font-medium">
                            {exp.company}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {exp.location}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                    {/* Timeline Dot (desktop only) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                      <div className="timeline-dot animate-pulse-glow" />
                    </div>

                    {/* Spacer for the other side */}
                    <div className="hidden md:block w-[calc(50%-32px)]" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
