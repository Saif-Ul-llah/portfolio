"use client";

import { useEffect, useState } from "react";

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
      <section id="experience" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400">Loading experiences...</div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">EXPERIENCE</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-8 border border-gray-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                  <p className="text-purple-400 font-medium">{exp.company}</p>
                </div>
              </div>

              <div className="space-y-2 text-gray-400 text-sm mb-4">
                <p>{exp.period}</p>
                <p>{exp.location}</p>
              </div>

              <p className="text-gray-300 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
