"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";


export const metadata = {
  title: "Donations | LifeLine",
  description:
    "Support LifeLine’s causes and make healthcare accessible to communities across Nigeria.",
};

const causes = [
  {
    title: "Rhema Primary School",
    description:
      "Rebuilding safe classrooms in Enugu, Nigeria. Your support will provide secure learning spaces for over 300 children affected by flooding and infrastructure collapse.",
    amount: "₦1,980,000",
    country: "NG",
    image: "placeholder.svg",
    impact:
      "Your donation helps build classrooms, supply books, and restore hope for children in need.",
  },
  {
    title: "Remember Youth for Change",
    description:
      "Vocational training for displaced youths. We equip former child laborers with technical and entrepreneurial skills for a better future.",
    amount: "₦2,550,000",
    country: "Nigeria",
    image: "placeholder.svg",
    impact:
      "Every ₦5,000 helps one young person learn a trade and regain dignity.",
  },
  {
    title: "Sudan Solidarity Collective",
    description:
      "Supporting war-affected families in Sudan with emergency healthcare and clean water access.",
    amount: "₦1,310,000",
    country: "SD",
    image: "placeholder.svg",
    impact:
      "Your contribution funds medicine, food, and clean water for families in crisis.",
  },
  {
    title: "Women’s Health Initiative",
    description:
      "Empowering women in rural Nigeria with access to reproductive healthcare, safe delivery services, and family planning education.",
    amount: "₦3,200,000",
    country: "NG",
    image: "placeholder.svg",
    impact:
      "₦10,000 can cover prenatal care for one expectant mother — saving lives.",
  },
  {
    title: "Clean Water Access Project",
    description:
      "Building boreholes and sanitation facilities across rural communities in Nigeria to prevent waterborne diseases.",
    amount: "₦2,750,000",
    country: "NG",
    image: "placeholder.svg",
    impact:
      "Clean water saves lives — every ₦15,000 helps provide safe drinking water to a family.",
  },
  {
    title: "Community Health Workers Training",
    description:
      "Training frontline health workers to reach underserved communities with preventive healthcare and education.",
    amount: "₦4,100,000",
    country: "NG",
    image: "placeholder.svg",
    impact:
      "Each ₦20,000 trains a local health worker who can serve hundreds of people per year.",
  },
];

export default function DonationsPage() {
  const [selectedCause, setSelectedCause] = useState<any | null>(null);

  return (
    <main className="min-h-screen bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Support Our Causes
          </h1>
          <p className="text-lg text-foreground/70">
            Every donation brings healthcare, education, and hope to
            under-resourced communities. Explore our ongoing causes below and
            join us in making a lasting impact.
          </p>
        </motion.div>

        {/* Causes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {causes.map((cause, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-[320px]">
                <Image
                  src={cause.image}
                  alt={cause.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <p className="text-sm mb-1 opacity-90">
                  {cause.amount} <span className="opacity-70">→ {cause.country}</span>
                </p>
                <h3 className="text-xl font-semibold mb-1">{cause.title}</h3>
                <p className="text-sm text-white/80 line-clamp-1 mb-4">
                  {cause.description}
                </p>

                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 transition-all"
                  onClick={() => setSelectedCause(cause)}
                >
                  View cause <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Dialog for Selected Cause */}
        <Dialog open={!!selectedCause} onOpenChange={() => setSelectedCause(null)}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl">
            {selectedCause && (
              <>
                <div className="relative w-full h-[300px] md:h-[400px]">
                  <Image
                    src={selectedCause.image}
                    alt={selectedCause.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">
                      {selectedCause.title}
                    </DialogTitle>
                    <DialogDescription className="text-foreground/80 text-base mb-4">
                      {selectedCause.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="text-primary font-semibold text-lg mb-2">
                    Goal: {selectedCause.amount} ({selectedCause.country})
                  </div>
                  <p className="text-sm text-foreground/70 mb-8">
                    {selectedCause.impact}
                  </p>

                  <DialogFooter>
                    <Button
                      size="lg"
                      className="bg-primary text-white hover:bg-primary/90 w-full rounded-xl"
                      onClick={() => alert(`Thank you for donating to ${selectedCause.title}! ❤️`)}
                    >
                      Donate Now
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
