"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    id: 1,
    role: "Senior MERN Stack Developer",
    company: "TechNova Solutions",
    location: "San Francisco, CA",
    period: "2021 - Present",
    description: "Leading the development of enterprise web applications using MERN stack technologies. Managing a team of five developers and overseeing project architecture and implementation.",
    responsibilities: [
      "Architected and built scalable web applications using React, Node.js, Express, and MongoDB",
      "Implemented CI/CD pipelines to streamline development and deployment processes",
      "Mentored junior developers and conducted code reviews to maintain high code quality",
      "Collaborated with UX/UI designers to implement responsive, user-friendly interfaces",
      "Optimized application performance resulting in 40% faster load times"
    ]
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Digital Dynamics",
    location: "Austin, TX",
    period: "2019 - 2021",
    description: "Developed and maintained multiple web applications for clients across various industries. Worked in an agile environment to deliver high-quality software on time.",
    responsibilities: [
      "Built RESTful APIs using Node.js and Express.js",
      "Developed responsive front-end applications using React and Redux",
      "Designed and maintained MongoDB database schemas and implemented data validation",
      "Integrated third-party APIs and services (payment gateways, social media, etc.)",
      "Implemented authentication and authorization using JWT and OAuth"
    ]
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "WebCraft Studios",
    location: "Remote",
    period: "2017 - 2019",
    description: "Focused on creating responsive and interactive user interfaces for web applications. Collaborated with back-end developers to integrate front-end components with server-side logic.",
    responsibilities: [
      "Developed interactive UIs using React and modern JavaScript",
      "Implemented responsive designs using CSS frameworks and custom styles",
      "Collaborated with designers to turn mockups into functional components",
      "Optimized front-end performance and accessibility",
      "Participated in daily stand-ups and sprint planning in an Agile team"
    ]
  }
];

export function ExperienceSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Work Experience
          </h2>
          <p className="text-lg text-muted-foreground">
            My professional journey as a MERN stack developer.
          </p>
        </motion.div>

        <div className="space-y-10 relative before:absolute before:inset-0 before:left-[19px] before:ml-px md:before:mx-auto before:h-full before:w-0.5 before:bg-border before:content-[''] md:before:left-1/2">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              variants={item}
              className={`flex items-center justify-between ${
                index % 2 === 0 ? "flex-row-reverse" : ""
              } md:gap-6`}
            >
              <div className="hidden md:block md:w-1/2"></div>

              <div className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-background shadow-md shadow-primary/5 ring-1 ring-border md:mx-auto">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>

              <Card className={`w-[calc(100%-4rem)] md:w-1/2 border border-border`}>
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
                    {experience.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}