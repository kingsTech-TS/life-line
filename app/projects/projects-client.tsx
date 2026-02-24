"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function ProjectsClient() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProjects(data); // Keep full data (don’t remap away needed fields)
        }
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
              key={project._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className="group overflow-hidden rounded-2xl bg-background/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 flex flex-col">
                {/* Image */}
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

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-xl text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-col text-xs text-foreground/60 space-y-1">
                      <span>📍 {project.country}</span>
                      {project.impact && <span>💡 {project.impact}</span>}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => setSelectedProject(project)}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dialog */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={(open) => {
            if (!open) setSelectedProject(null);
          }}
        >
          <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 rounded-2xl md:rounded-3xl border-none shadow-2xl">
            {selectedProject && (
              <div className="flex flex-col">
                {/* Image */}
                <div className="relative w-full h-[220px] sm:h-[280px] md:h-[350px]">
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
                      {selectedProject.title}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-base mb-4">
                      {selectedProject.description}
                    </DialogDescription>
                  </DialogHeader>

                  {selectedProject.goalAmount && (
                    <div className="text-primary font-semibold text-lg mb-2">
                      Goal: ₦{selectedProject.goalAmount?.toLocaleString()} (
                      {selectedProject.country})
                    </div>
                  )}

                  {selectedProject.impact && (
                    <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                      {selectedProject.impact}
                    </p>
                  )}

                  <DialogFooter>
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => {
                        alert(
                          `Thank you for supporting ${selectedProject.title}! ❤️`,
                        );
                        setSelectedProject(null);
                      }}
                    >
                      Donate Now
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
