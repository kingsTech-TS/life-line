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
            open={!!selectedCause}
            onOpenChange={(open) => !open && setSelectedCause(null)}
          >
            <DialogContent
              className="
                w-full
                max-w-6xl
                h-[100dvh] md:h-[90vh]
                p-0
                rounded-none md:rounded-3xl
                border-none
                overflow-hidden
              "
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* IMAGE SIDE */}
                <div className="relative w-full md:w-1/2 h-64 md:h-full md:sticky md:top-0">
                  <Image
                    src={selectedCause.image}
                    alt={selectedCause.title}
                    fill
                    className="object-cover"
                  />

                  <button
                    onClick={() => setSelectedCause(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* CONTENT SIDE */}
                <div className="w-full md:w-1/2 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-8">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-black">
                        {selectedCause.title}
                      </DialogTitle>
                    </DialogHeader>

                    <p className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedCause.description}
                    </p>

                    {selectedCause.impact && (
                      <div className="mt-8 p-5 rounded-2xl bg-primary/10 flex gap-4">
                        <ShieldCheck className="text-primary mt-1" />
                        <p className="font-semibold text-foreground/80">
                          {selectedCause.impact}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* STICKY FOOTER */}
                  <div className="p-6 border-t bg-background">
                    <Button className="w-full h-14 font-bold text-lg">
                      Donate Now
                    </Button>

                    <div className="mt-3 flex justify-center items-center gap-2 text-xs text-muted-foreground">
                      <Users size={12} /> Join 1,200+ lifeliners
                    </div>
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
