"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Project = {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
  details: {
    challenge: string;
    solution: string;
    features: string[];
    technologies: string[];
    results: string;
  };
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 md:py-32 bg-muted/30">
        <div className="container text-center">Loading projects...</div>
      </section>
    );
  }

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground">
            A selection of my recent work, showcasing my skills and expertise in full-stack development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <motion.div key={project._id} variants={item}>
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
                      {project.liveUrl && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">Live Demo</span>
                          </a>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            <span className="sr-only">GitHub Repository</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>

                {/* Dialog Details */}
                <DialogContent className="max-w-4xl">
                  {selectedProject && selectedProject._id === project._id && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                        <DialogDescription>{selectedProject.description}</DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full aspect-video mt-2 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">The Challenge</h3>
                          <p className="text-muted-foreground">{selectedProject.details.challenge}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">The Solution</h3>
                          <p className="text-muted-foreground">{selectedProject.details.solution}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {selectedProject.details.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Technologies Used</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.details.technologies.map((tech) => (
                              <Badge key={tech}>{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Results</h3>
                          <p className="text-muted-foreground">{selectedProject.details.results}</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          {selectedProject.repoUrl && (
                            <Button variant="outline" asChild>
                              <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                View Code
                              </a>
                            </Button>
                          )}
                          {selectedProject.liveUrl && (
                            <Button asChild>
                              <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Live Demo
                              </a>
                            </Button>
                          )}
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
