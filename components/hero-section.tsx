"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import ThreeScene from "@/components/three-scene";

export function HeroSection() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeScene />
      <div
        className={cn(
          "container px-4 sm:px-6 lg:px-8 relative z-10",
          scrolled ? "opacity-0 translate-y-10" : "opacity-100"
        )}
      >
        <div className="max-w-4xl mx-auto py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-block rounded-full px-3 py-1 bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <Code size={16} />
                <span>MERN Stack Developer</span>
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6"
          >
            Building digital experiences with 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500 dark:from-blue-400 dark:to-violet-400">
              {" "}modern web technologies
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground mb-10 max-w-2xl "
          >
            Specialized in crafting performant web applications using Javascript/Typescript, SQL, Prisma, MongoDB,
            Express.js, React, and Node.js, Next.js. Let&apos;s turn your ideas into reality
            with clean code and beautiful user experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" asChild>
              <a href="#projects">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">
                Contact Me
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 border border-border"
          asChild
        >
          <a href="#about">
            <ArrowDown className="h-5 w-5" />
            <span className="sr-only">Scroll down</span>
          </a>
        </Button>
      </div>
    </section>
  );
}