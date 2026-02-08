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
    <section className="relative py-32 bg-muted/20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          >
            Be Someone’s <span className="text-primary italic">LifeLine.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Your support does more than fund a cause—it restores dignity and gives
            a community the chance to thrive.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-24 text-foreground/40 font-bold">
            Loading causes…
          </div>
        )}

        {/* Scrolling Cards */}
        {!loading && causes.length > 0 && (
          <div className="relative group">
            <div className="flex overflow-hidden relative">
              <motion.div
                className="flex gap-8 py-4"
                animate={
                  reduceMotion ? undefined : { x: ["0%", "-50%"] }
                }
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 30,
                }}
              >
                {[...causes, ...causes].map((cause, index) => (
                  <div
                    key={`${cause.title}-${index}`}
                    className="relative min-w-[320px] sm:min-w-[400px] h-[500px] rounded-[2.5rem] overflow-hidden bg-background shadow-2xl transition-all duration-500 hover:-translate-y-4"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={cause.image}
                        alt={cause.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    </div>

                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-4">
                      <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-full">
                        <Target size={14} />
                        Target: {cause.amount}
                      </div>

                      <h3 className="text-3xl font-black leading-tight">
                        {cause.title}
                      </h3>

                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <MapPin size={14} />
                        {cause.country}
                      </div>

                      <p className="text-white/70 line-clamp-2 text-sm">
                        {cause.description}
                      </p>

                      <div className="pt-2 opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => setSelectedCause(cause)}
                          className="w-full h-14 rounded-2xl bg-white text-black hover:bg-primary hover:text-white font-black"
                        >
                          Support this Cause
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {selectedCause && (
          <Dialog
            open={!!selectedCause}
            onOpenChange={(open) => !open && setSelectedCause(null)}
          >
            <DialogContent className="max-w-5xl h-[100dvh] md:h-[85vh] p-0 rounded-none md:rounded-[3rem] border-none shadow-2xl">
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-1/2 h-56 md:h-full">
                  <Image
                    src={selectedCause.image}
                    alt={selectedCause.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={() => setSelectedCause(null)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-black/40 text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-black">
                      {selectedCause.title}
                    </DialogTitle>
                  </DialogHeader>

                  <p className="mt-4 text-foreground/60">
                    {selectedCause.description}
                  </p>

                  <div className="mt-6 p-4 rounded-xl bg-primary/5 flex gap-3">
                    <ShieldCheck className="text-primary" />
                    <p className="font-bold italic text-foreground/70">
                      "{selectedCause.impact}"
                    </p>
                  </div>

                  <Button className="mt-8 w-full h-14 font-black">
                    Donate Now
                  </Button>

                  <div className="mt-4 flex justify-center items-center gap-2 text-xs text-foreground/40">
                    <Users size={12} /> Join 1,200+ lifeliners
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
}
