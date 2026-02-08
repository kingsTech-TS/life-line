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
          <Dialog open onOpenChange={() => setSelectedCause(null)}>
            <DialogContent
              className="
          max-w-5xl w-[96vw] md:w-full
          h-[100dvh] md:h-[85vh]
          max-h-[100dvh]
          p-0 overflow-hidden
          rounded-none md:rounded-[3rem]
          border-none shadow-2xl bg-background
          flex flex-col
        "
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-48 sm:h-56 md:h-full shrink-0">
                  <Image
                    src={selectedCause.image}
                    alt={selectedCause.title}
                    fill
                    priority
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/40 md:to-transparent" />

                  {/* Unified Close Button */}
                  <button
                    onClick={() => setSelectedCause(null)}
                    className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition z-20"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content Section */}
                <div
                  className="
              relative w-full md:w-1/2
              flex flex-col
              bg-background
              overflow-y-auto overscroll-contain
            "
                >
                  <div className="px-5 py-6 sm:p-8 md:p-10 lg:p-12 flex flex-col gap-6 min-h-full">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs">
                        <Target size={14} />
                        Active Project
                      </div>

                      <DialogHeader className="p-0">
                        <DialogTitle className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                          {selectedCause.title}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 sm:p-4 rounded-xl bg-muted/50 border">
                          <div className="text-primary font-black text-lg sm:text-xl">
                            {selectedCause.amount}
                          </div>
                          <div className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                            Goal Amount
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 rounded-xl bg-muted/50 border">
                          <div className="font-black text-lg sm:text-xl">
                            {selectedCause.country.split(",")[0]}
                          </div>
                          <div className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">
                            Location
                          </div>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base md:text-lg text-foreground/60 leading-relaxed">
                        {selectedCause.description}
                      </p>

                      <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                          <ShieldCheck size={18} />
                        </div>
                        <p className="text-sm font-bold text-foreground/70 italic">
                          "{selectedCause.impact}"
                        </p>
                      </div>
                    </div>

                    {/* CTA pinned naturally at bottom */}
                    <div className="pt-6 mt-auto space-y-4">
                      <Button
                        size="lg"
                        className="w-full h-14 sm:h-16 rounded-xl bg-primary text-white font-black shadow-xl hover:scale-[1.02] active:scale-95 transition"
                      >
                        Donate Now
                      </Button>

                      <div className="flex justify-center items-center gap-2 text-[10px] sm:text-xs font-black text-foreground/30 uppercase tracking-widest">
                        <Users size={12} />
                        Join 1,200+ lifeliners
                      </div>
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
