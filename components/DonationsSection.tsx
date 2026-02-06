"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Target,
  Users,
  X,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const causes = [
  {
    title: "Rhema Primary School",
    description:
      "Rebuilding safe classrooms in Enugu, Nigeria. Your support will provide secure learning spaces for over 300 children affected by flooding and infrastructure collapse.",
    amount: "₦1,980,000",
    country: "Enugu, Nigeria",
    image: "/placeholder.svg",
    impact:
      "Your donation helps build classrooms, supply books, and restore hope for children in need.",
  },
  {
    title: "Remember Youth for Change",
    description:
      "Vocational training for displaced youths. We equip former child laborers with technical and entrepreneurial skills for a better future.",
    amount: "₦2,550,000",
    country: "Lagos, Nigeria",
    image: "/placeholder.svg",
    impact:
      "Every ₦5,000 helps one young person learn a trade and regain dignity.",
  },
  {
    title: "Sudan Solidarity Collective",
    description:
      "Supporting war-affected families in Sudan with emergency healthcare and clean water access.",
    amount: "₦1,310,000",
    country: "Khartoum, Sudan",
    image: "/placeholder.svg",
    impact:
      "Your contribution funds medicine, food, and clean water for families in crisis.",
  },
  {
    title: "Women’s Health Initiative",
    description:
      "Empowering women in rural Nigeria with access to reproductive healthcare, safe delivery services, and family planning education.",
    amount: "₦3,200,000",
    country: "Oyo, Nigeria",
    image: "/placeholder.svg",
    impact:
      "₦10,000 can cover prenatal care for one expectant mother — saving lives.",
  },
];

export default function DonationsSection() {
  const [selectedCause, setSelectedCause] = useState<any | null>(null);

  return (
    <section className="relative py-32 bg-muted/20 overflow-hidden">
      {/* Background Grain/Texture Overlay could be added via CSS if desired */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4"
          >
            <Heart size={12} className="fill-current" />
            Live Impact Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none"
          >
            Be Someone’s <span className="text-primary italic">LifeLine.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Your support does more than fund a cause—it restores dignity and
            gives a community the chance to thrive.
          </motion.p>
        </div>

        {/* Continuous Scrolling Cards Area */}
        <div className="relative group">
          <div className="flex overflow-hidden relative">
            <motion.div
              className="flex gap-8 py-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 30,
              }}
            >
              {[...causes, ...causes].map((cause, index) => (
                <div
                  key={index}
                  className="relative min-w-[320px] sm:min-w-[400px] h-[500px] rounded-[2.5rem] overflow-hidden group/card bg-background shadow-2xl shadow-foreground/5 transition-all duration-500 hover:-translate-y-4 hover:shadow-primary/10"
                >
                  {/* Image with Parallax-like effect */}
                  <div className="absolute inset-0">
                    <Image
                      src={cause.image}
                      alt={cause.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-4">
                    <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-full ring-1 ring-white/20">
                      <Target size={14} />
                      Target: {cause.amount}
                    </div>

                    <h3 className="text-3xl font-black leading-tight tracking-tight group-hover/card:text-primary transition-colors">
                      {cause.title}
                    </h3>

                    <div className="flex items-center gap-2 text-white/60 font-medium text-sm">
                      <MapPin size={14} />
                      {cause.country}
                    </div>

                    <p className="text-white/70 line-clamp-2 text-sm font-medium">
                      {cause.description}
                    </p>

                    <motion.div className="pt-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <Button
                        onClick={() => setSelectedCause(cause)}
                        className="w-full h-14 rounded-2xl bg-white text-black hover:bg-primary hover:text-white font-black transition-all"
                      >
                        Support this Cause{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Overlay Gradient */}
        <div className="mt-20 text-center">
          <p className="text-foreground/40 font-bold italic mb-6">
            Drag to explore more causes or click to see impact details.
          </p>
        </div>
      </div>

      {/* Premium Dialog */}
      <AnimatePresence>
        {selectedCause && (
          <Dialog
            open={!!selectedCause}
            onOpenChange={() => setSelectedCause(null)}
          >
            <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl bg-background outline-none">
              <div className="flex flex-col md:flex-row h-[90vh] md:h-auto">
                {/* Dialog Image Section */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <Image
                    src={selectedCause.image}
                    alt={selectedCause.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:bg-gradient-to-b" />
                  <button
                    onClick={() => setSelectedCause(null)}
                    className="absolute top-6 left-6 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all md:hidden"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Dialog Content Section */}
                <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between space-y-8 bg-background relative">
                  <button
                    onClick={() => setSelectedCause(null)}
                    className="absolute top-8 right-8 p-2 rounded-full hover:bg-muted text-foreground/40 transition-colors hidden md:block"
                  >
                    <X size={24} />
                  </button>

                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                      <Target size={16} />
                      Active Project
                    </div>
                    <DialogHeader>
                      <DialogTitle className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                        {selectedCause.title}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-2xl bg-muted/50 border border-border">
                        <div className="text-primary font-black text-xl mb-1">
                          {selectedCause.amount}
                        </div>
                        <div className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                          Goal Amount
                        </div>
                      </div>
                      <div className="flex-1 p-4 rounded-2xl bg-muted/50 border border-border">
                        <div className="text-foreground font-black text-xl mb-1">
                          {selectedCause.country.split(",")[0]}
                        </div>
                        <div className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                          Location
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-foreground/60 font-medium leading-relaxed">
                      {selectedCause.description}
                    </p>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                        <ShieldCheck size={20} />
                      </div>
                      <p className="text-sm font-bold text-foreground/70 italic">
                        "{selectedCause.impact}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button
                      size="lg"
                      className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                      onClick={() =>
                        alert(
                          `Redirecting to payment for ${selectedCause.title}...`,
                        )
                      }
                    >
                      Donate Now
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-xs font-black text-foreground/30 uppercase tracking-[0.1em]">
                      <Users size={14} />
                      Join 1,200+ other lifeliners
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
