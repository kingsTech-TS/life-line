"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export default function DonationsPage() {
  const [selectedCause, setSelectedCause] = useState<any | null>(null);
  const [causes, setCauses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCauses(data);
        }
      } catch (error) {
        console.error("Failed to fetch causes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCauses();
  }, []);

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <span className="text-foreground/40 font-medium">
              Fetching causes...
            </span>
          </div>
        ) : causes.length === 0 ? (
          <div className="text-center py-20 text-foreground/40">
            No active causes found at the moment.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {causes.map((cause, index) => (
              <motion.div
                key={cause._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative w-full h-[320px]">
                  <Image
                    src={cause.image || "placeholder.svg"}
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
                    ₦{cause.goalAmount?.toLocaleString()}{" "}
                    <span className="opacity-70">→ {cause.country}</span>
                  </p>
                  <h3 className="text-xl font-semibold mb-1">{cause.title}</h3>
                  <p className="text-sm text-white/80 line-clamp-1 mb-4">
                    {cause.description}
                  </p>

                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 transition-all font-bold"
                    onClick={() => setSelectedCause(cause)}
                  >
                    View cause <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Dialog for Selected Cause */}
        <Dialog
          open={!!selectedCause}
          onOpenChange={() => setSelectedCause(null)}
        >
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none">
            {selectedCause && (
              <>
                <div className="relative w-full h-[300px] md:h-[400px]">
                  <Image
                    src={selectedCause.image || "placeholder.svg"}
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

                  <div className="text-primary font-bold text-lg mb-2">
                    Goal: ₦{selectedCause.goalAmount?.toLocaleString()} (
                    {selectedCause.country})
                  </div>
                  <p className="text-sm text-foreground/70 mb-8">
                    {selectedCause.impact}
                  </p>

                  <DialogFooter>
                    <Button
                      size="lg"
                      className="bg-primary text-white hover:bg-primary/90 w-full rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
                      onClick={() =>
                        alert(
                          `Thank you for donating to ${selectedCause.title}! ❤️`,
                        )
                      }
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
