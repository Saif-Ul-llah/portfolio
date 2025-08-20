"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Download,
  Code,
  Server,
  Database,
  Globe,
  ShieldCheck,
  Cloud,
  Box,
  Settings,
} from "lucide-react";

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const skills = [
    {
      icon: <Code className="h-4 w-4 text-primary" />,
      title: "Front-End Development",
      description:
        "Building responsive, accessible, and performant UIs with React & Next.js.",
    },
    {
      icon: <Server className="h-4 w-4 text-primary" />,
      title: "Back-End Engineering",
      description:
        "Developing scalable APIs & services with Node.js and Express.",
    },
    {
      icon: <Database className="h-4 w-4 text-primary" />,
      title: "Database Design",
      description: "Designing optimized schemas in MongoDB, SQL, and Postgres.",
    },
    {
      icon: <Globe className="h-4 w-4 text-primary" />,
      title: "Full-Stack Integration",
      description:
        "Seamlessly connecting front-end & back-end for smooth user experiences.",
    },
    {
      icon: <Settings className="h-4 w-4 text-primary" />,
      title: "DevOps & Deployment",
      description:
        "CI/CD pipelines, monitoring, and infrastructure optimization.",
    },
    {
      icon: <Box className="h-4 w-4 text-primary" />,
      title: "Docker & Containers",
      description:
        "Packaging applications into containers for consistency & scalability.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-primary" />,
      title: "Web Servers",
      description:
        "Configuring Nginx & Apache for secure, high-performance delivery.",
    },
    {
      icon: <Cloud className="h-4 w-4 text-primary" />,
      title: "VPS Management",
      description:
        "Deploying & managing VPS with strong security and uptime practices.",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="container px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I am a MERN Stack Developer passionate about designing scalable web
            applications that blend performance with elegant design. With 3+
            years of professional experience, I focus on creating solutions that
            are both technically robust and user-friendly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            variants={fadeInUp}
            className="relative rounded-xl overflow-hidden shadow-lg"
          >
            <div className="aspect-square relative flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-violet-600/20">
              <Image
                src="https://res.cloudinary.com/saif-ul-llah/image/upload/v1755721817/k6rvr6qr9heyzh6pbujw.png"
                alt="Saifullah - MERN Stack Developer"
                width={550}
                height={400}
                className="object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">Saif-ul-llah</h3>
                <p className="text-white/80">MERN Stack Developer</p>
              </div>
            </div>
          </motion.div>

          {/* Skills & Bio */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-2xl font-bold mb-4">
              Turning ideas into impactful digital experiences
            </h3>
            <p className="text-muted-foreground mb-8">
              I specialize in crafting end-to-end web solutions — from
              pixel-perfect interfaces to optimized back-end architectures. My
              goal is to deliver applications that not only work flawlessly but
              also delight users.
            </p>

            <div className="space-y-5 mb-10">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    {skill.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{skill.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {skill.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://drive.google.com/uc?export=download&id=1ufyJdFXz_R1eT3D6CguNvhX6OjWCx5x-"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2 shadow-md">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
