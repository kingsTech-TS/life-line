"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function ProjectsClient() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        const mappedProjects = data.map((project: any) => ({
          title: project.title,
          description: project.description,
          image: project.image,
          location: project.country,
          impact: project.impact,
        }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="py-32 text-center text-foreground/70">
        Loading projects…
      </div>
    );
  }

  return (
    <main className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Projects
          </h1>
          <p className="text-foreground/70 text-lg">
            Every LifeLine project is built on compassion, data, and community
            collaboration. Together, we’re turning hope into health across
            Nigeria.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className="group overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                {/* Project Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl">
                      🩺
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-col text-xs text-foreground/60 space-y-1">
                      <span>📍 {project.location}</span>
                      <span>💡 {project.impact}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
