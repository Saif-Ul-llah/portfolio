"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin } from "lucide-react";

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/experiences`); // ✅ adjust API base URL
        const data = await res.json();
        setExperiences(data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="experience" className="py-20 md:py-32">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="container px-4 sm:px-6 lg:px-8 mx-auto "
      >
        <motion.div variants={item} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work Experience</h2>
          <p className="text-lg text-muted-foreground">
            My professional journey as a MERN stack developer.
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading experiences...</p>
        ) : (
          <div className="space-y-10 relative before:absolute before:inset-0 before:left-[19px] before:ml-px md:before:mx-auto before:h-full before:w-0.5 before:bg-border before:content-[''] md:before:left-1/2">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience._id}
                variants={item}
                className={`flex items-center justify-between ${
                  index % 2 === 0 ? "flex-row-reverse" : ""
                } md:gap-6`}
              >
                <div className="hidden md:block md:w-1/2"></div>

                <div className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background shadow-md shadow-primary/5 ring-1 ring-border md:mx-auto">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>

                <Card className="w-[calc(100%-4rem)] md:w-1/2 border border-border">
                  <CardHeader>
                    <CardTitle>{experience.role}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      <span className="font-medium text-foreground">{experience.company}</span>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{experience.period}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">{experience.description}</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {experience.responsibilities?.map((task: string, i: number) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
