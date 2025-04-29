"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Code } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with secure payment processing, user authentication, and admin dashboard.",
    image: "https://images.pexels.com/photos/6956892/pexels-photo-6956892.jpeg",
    tags: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    details: {
      challenge: "Building a scalable and secure e-commerce platform that can handle high traffic and transactions.",
      solution: "Implemented a microservices architecture with separate services for product management, user authentication, and payment processing.",
      features: [
        "User authentication and profile management",
        "Product listings with search and filtering",
        "Shopping cart and checkout process",
        "Payment processing with Stripe",
        "Order tracking and history",
        "Admin dashboard for product management"
      ],
      technologies: ["React", "Node.js", "Express", "MongoDB", "Redux", "JWT", "Stripe API", "AWS S3"],
      results: "The platform successfully handles thousands of transactions daily with a 99.9% uptime, resulting in a 30% increase in sales for the client."
    }
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, file sharing, and team communication features.",
    image: "https://images.pexels.com/photos/3774903/pexels-photo-3774903.jpeg",
    tags: ["Next.js", "Express", "MongoDB", "Socket.io", "Redux", "JWT"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    details: {
      challenge: "Creating a real-time collaboration tool that allows teams to manage tasks efficiently.",
      solution: "Used Socket.io for real-time updates and implemented a robust notification system to keep team members informed of changes.",
      features: [
        "Task creation, assignment, and status tracking",
        "Real-time updates and notifications",
        "Team chat and commenting on tasks",
        "File attachment and sharing",
        "Calendar view and deadline management",
        "Performance analytics and reporting"
      ],
      technologies: ["Next.js", "Express", "MongoDB", "Socket.io", "Redux", "JWT", "AWS S3"],
      results: "The application has been adopted by over 50 teams, leading to a reported 25% increase in productivity."
    }
  },
  {
    id: 3,
    title: "Social Media Analytics Dashboard",
    description: "A comprehensive analytics dashboard for social media managers to track performance across multiple platforms.",
    image: "https://images.pexels.com/photos/7682340/pexels-photo-7682340.jpeg",
    tags: ["React", "Node.js", "GraphQL", "MongoDB", "Chart.js", "Material UI"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    details: {
      challenge: "Aggregating data from multiple social media platforms and presenting it in a meaningful, actionable way.",
      solution: "Created a unified API using GraphQL to fetch and normalize data from different social media platforms, then built interactive visualizations using Chart.js.",
      features: [
        "Cross-platform analytics in a single dashboard",
        "Real-time data updates",
        "Custom report generation",
        "Audience demographics analysis",
        "Content performance tracking",
        "Campaign ROI calculation"
      ],
      technologies: ["React", "Node.js", "GraphQL", "MongoDB", "Chart.js", "Material UI", "Social Media APIs"],
      results: "The dashboard has helped clients optimize their social media strategies, resulting in an average engagement increase of 40%."
    }
  },
  {
    id: 4,
    title: "Real Estate Listing Platform",
    description: "A modern real estate platform with advanced search, virtual tours, and agent-client communication tools.",
    image: "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg",
    tags: ["Next.js", "Express", "MongoDB", "Three.js", "Google Maps API"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    details: {
      challenge: "Creating an immersive and user-friendly platform for real estate listings with advanced visualization features.",
      solution: "Implemented Three.js for virtual property tours and integrated with Google Maps API for location-based searching and neighborhood insights.",
      features: [
        "Advanced property search with filters",
        "Virtual 3D property tours",
        "Interactive neighborhood maps",
        "Agent-client messaging system",
        "Appointment scheduling",
        "Property favoriting and comparison"
      ],
      technologies: ["Next.js", "Express", "MongoDB", "Three.js", "Google Maps API", "AWS S3", "Twilio"],
      results: "The platform has facilitated over 500 property transactions and reduced the average time-to-sale by 15%."
    }
  }
];

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);
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
    <section id="projects" className="py-20 md:py-32 bg-muted/30">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="container px-4 sm:px-6 lg:px-8 mx-auto"
      >
        <motion.div variants={item} className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground">
            A selection of my recent work, showcasing my skills and expertise in full-stack development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Dialog>
                <Card className="overflow-hidden h-full flex flex-col group">
                  <div className="relative overflow-hidden w-full aspect-video">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 4 && (
                        <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm">
                          +{project.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedProject(project)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Live Demo</span>
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                          <span className="sr-only">GitHub Repository</span>
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                <DialogContent className="max-w-4xl">
                  {selectedProject && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{selectedProject?.title}</DialogTitle>
                        <DialogDescription>{selectedProject?.description}</DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full aspect-video mt-2 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={selectedProject?.image}
                          alt={selectedProject?.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">The Challenge</h3>
                          <p className="text-muted-foreground">{selectedProject?.details?.challenge}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">The Solution</h3>
                          <p className="text-muted-foreground">{selectedProject?.details?.solution}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {selectedProject?.details?.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject?.details?.technologies.map((tech) => (
                              <Badge key={tech}>{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Results</h3>
                          <p className="text-muted-foreground">{selectedProject?.details?.results}</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" asChild>
                            <a href={selectedProject?.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <Github className="h-4 w-4" />
                              View Code
                            </a>
                          </Button>
                          <Button asChild>
                            <a href={selectedProject?.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Live Demo
                            </a>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}