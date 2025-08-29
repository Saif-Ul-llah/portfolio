"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const levelMap: Record<string, number> = {
  Beginner: 40,
  Intermediate: 65,
  Advanced: 85,
  Expert: 95,
};

export function SkillsSection() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`); // 👈 change API URL
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category.toLowerCase(); // frontend, backend, other
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        ...skill,
        levelPercent: levelMap[skill.level] || 0,
      });
      return acc;
    },
    { frontend: [], backend: [], other: [] } as Record<string, any[]>
  );

  return (
    <section id="skills" className="py-20 md:py-32">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="container px-4 sm:px-6 lg:px-8 mx-auto"
      >
        <motion.div variants={item} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Skills</h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive set of technical skills honed through years of experience
            in full-stack development.
          </p>
        </motion.div>

        {loading ? (
          <p className="text-center">Loading skills...</p>
        ) : (
          <motion.div variants={item}>
            <Tabs defaultValue="frontend" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
              </div>

              {["frontend", "backend", "other"].map((category) => (
                <TabsContent key={category} value={category} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupedSkills[category].map((skill: any, index: number) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">⚡</span>
                                <h3 className="font-medium">{skill.name}</h3>
                              </div>
                              <span className="text-sm font-medium">
                                {skill.level} ({skill.levelPercent}%)
                              </span>
                            </div>
                            <Progress value={skill.levelPercent} className="h-2" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
