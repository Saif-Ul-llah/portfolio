"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Code, Server, Database, Globe } from "lucide-react";

export function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="container px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground">
            Passionate MERN stack developer with a strong focus on creating elegant solutions to complex problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-lg">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center">
              <Image
                src="https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg"
                alt="Developer working"
                width={600}
                height={600}
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-white/80">MERN Stack Developer</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-2xl font-bold mb-4">
              Crafting digital solutions for the modern web
            </h3>
            <p className="text-muted-foreground mb-6">
              With over 5 years of experience in full-stack development, I specialize in building 
              scalable, high-performance web applications using the MERN stack. My approach combines 
              technical excellence with an eye for design, ensuring that every project is not just 
              functional, but also user-friendly and visually appealing.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Code className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Front-end Development</h4>
                  <p className="text-sm text-muted-foreground">Creating responsive, intuitive user interfaces with React and Next.js</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Back-end Engineering</h4>
                  <p className="text-sm text-muted-foreground">Building robust APIs and services with Node.js and Express</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Database Design</h4>
                  <p className="text-sm text-muted-foreground">Designing and optimizing MongoDB databases for performance and scalability</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Full Stack Integration</h4>
                  <p className="text-sm text-muted-foreground">Connecting all parts of the application for seamless functionality</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Resume
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}