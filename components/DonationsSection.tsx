"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Target,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type Cause = {
  title: string;
  description: string;
  amount: string;
  country: string;
  image: string;
  impact: string;
};

export default function DonationsSection() {
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();

        const projects: Cause[] = data.map((project: any) => ({
          title: project.title,
          description: project.description,
          amount: `₦${Number(project.goalAmount).toLocaleString()}`,
          country: project.country,
          image: project.image || "/placeholder.svg",
          impact: project.impact,
        }));

        setCauses(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="relative py-24 bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            Be Someone’s <span className="text-primary italic">LifeLine.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-lg text-muted-foreground"
          >
            Your support restores dignity and gives communities a chance to
            thrive.
          </motion.p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-muted-foreground font-semibold">
            Loading causes…
          </div>
        )}

        {/* CARDS */}
        {!loading && causes.length > 0 && (
          <div className="flex overflow-x-auto gap-8 pb-6 snap-x snap-mandatory scrollbar-hide">
            {causes.map((cause, index) => (
              <div
                key={`${cause.title}-${index}`}
                className="relative min-w-[320px] sm:min-w-[380px] h-[520px] rounded-3xl overflow-hidden bg-background shadow-xl snap-center shrink-0 transition-transform duration-300 hover:-translate-y-2"
              >
                <Image
                  src={cause.image}
                  alt={cause.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-6 text-white space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-white/20 px-3 py-1 rounded-full w-fit">
                    <Target size={14} />
                    Target: {cause.amount}
                  </div>

                  <h3 className="text-2xl font-black">{cause.title}</h3>

                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <MapPin size={14} />
                    {cause.country}
                  </div>

                  <p className="text-sm text-white/80 line-clamp-3">
                    {cause.description}
                  </p>

                  <Button
                    onClick={() => setSelectedCause(cause)}
                    className="w-full h-12 rounded-xl bg-white text-black hover:bg-primary hover:text-white font-bold"
                  >
                    Support this Cause
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIALOG */}
      <AnimatePresence>
        {selectedCause && (
          <Dialog
            open={true}
            onOpenChange={(open) => {
              if (!open) setSelectedCause(null);
            }}
          >
            <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 rounded-2xl md:rounded-3xl border-none shadow-2xl">
              <div className="flex flex-col">
                {/* Image */}
                <div className="relative w-full h-[220px] sm:h-[280px] md:h-[350px]">
                  <Image
                    src={selectedCause.image}
                    alt={selectedCause.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl font-bold">
                      {selectedCause.title}
                    </DialogTitle>
                  </DialogHeader>

                  <p className="text-muted-foreground">
                    {selectedCause.description}
                  </p>

                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Target size={16} />
                    {selectedCause.amount} ({selectedCause.country})
                  </div>

                  {selectedCause.impact && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedCause.impact}
                    </p>
                  )}

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                    onClick={() => {
                      alert(
                        `Thank you for supporting ${selectedCause.title}! ❤️`,
                      );
                      setSelectedCause(null);
                    }}
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
