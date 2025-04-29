"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const frontendSkills = [
  { name: "React.js", level: 95, icon: "⚛️" },
  { name: "Next.js", level: 90, icon: "▲" },
  { name: "JavaScript", level: 95, icon: "𝐉𝐒" },
  { name: "TypeScript", level: 85, icon: "𝐓𝐒" },
  { name: "HTML5/CSS3", level: 90, icon: "🌐" },
  { name: "Tailwind CSS", level: 90, icon: "🌊" },
  { name: "Redux", level: 85, icon: "🔄" },
];

const backendSkills = [
  { name: "Node.js", level: 90, icon: "🟢" },
  { name: "Express.js", level: 90, icon: "🚂" },
  { name: "MongoDB", level: 85, icon: "🍃" },
  { name: "REST API", level: 90, icon: "🔌" },
  { name: "GraphQL", level: 80, icon: "◼️" },
  { name: "JWT Auth", level: 85, icon: "🔐" },
  { name: "Socket.io", level: 75, icon: "🔄" },
];

const otherSkills = [
  { name: "Git/GitHub", level: 90, icon: "🐙" },
  { name: "Docker", level: 80, icon: "🐳" },
  { name: "AWS", level: 75, icon: "☁️" },
  { name: "Jest", level: 85, icon: "🧪" },
  { name: "CI/CD", level: 80, icon: "🔄" },
  { name: "Three.js", level: 70, icon: "🎮" },
  { name: "Responsive Design", level: 90, icon: "📱" },
];

export function SkillsSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="skills" className="py-20 md:py-32">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="container px-4 sm:px-6 lg:px-8 mx-auto "
      >
        <motion.div variants={item} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My Skills
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive set of technical skills honed through years of experience
            in full-stack development.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="frontend" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="frontend" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {frontendSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{skill.icon}</span>
                            <h3 className="font-medium">{skill.name}</h3>
                          </div>
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="backend" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {backendSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{skill.icon}</span>
                            <h3 className="font-medium">{skill.name}</h3>
                          </div>
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{skill.icon}</span>
                            <h3 className="font-medium">{skill.name}</h3>
                          </div>
                          <span className="text-sm font-medium">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </section>
  );
}