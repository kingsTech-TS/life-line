"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";


const projects = [
  {
    title: "Community Health Clinics",
    description:
      "Establishing mobile and rural clinics to bring essential healthcare directly to underserved communities.",
    image: "placeholder.svg",
    location: "Kano, Nigeria",
    impact: "10,000+ patients served",
  },
  {
    title: "Maternal Health Initiative",
    description:
      "Providing safe delivery kits and prenatal care education to reduce maternal mortality rates.",
    image: "placeholder.svg",
    location: "Enugu, Nigeria",
    impact: "1,200 mothers supported",
  },
  {
    title: "Youth Health Education",
    description:
      "Training young leaders to promote hygiene, nutrition, and preventive health in schools.",
    image: "placeholder.svg",
    location: "Lagos, Nigeria",
    impact: "3,500 students reached",
  },
  {
    title: "Clean Water for Health",
    description:
      "Installing boreholes and sanitation facilities to reduce waterborne diseases.",
    image: "placeholder.svg",
    location: "Kaduna, Nigeria",
    impact: "15 communities served",
  },
   {
    title: "Maternal Health Initiative",
    description:
      "Providing safe delivery kits and prenatal care education to reduce maternal mortality rates.",
    image: "placeholder.svg",
    location: "Enugu, Nigeria",
    impact: "1,200 mothers supported",
  },
  {
    title: "Youth Health Education",
    description:
      "Training young leaders to promote hygiene, nutrition, and preventive health in schools.",
    image: "placeholder.svg",
    location: "Lagos, Nigeria",
    impact: "3,500 students reached",
  },
];

export default function ProjectsClient() {
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
                    <Button
                      variant="outline"
                      className="w-full border-foreground/20 bg-primary hover:bg-primary/90 text-white transition-colors"
                    >
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
