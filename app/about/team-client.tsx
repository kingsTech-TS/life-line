"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Dr. Amara Okafor",
    role: "Executive Director",
    image: "placeholder.svg",
  },
  {
    name: "Chioma Adeyemi",
    role: "Head of Programs",
    image: "placeholder.svg",
  },
  {
    name: "Tunde Oluwaseun",
    role: "Finance Director",
    image: "placeholder.svg",
  },
  {
    name: "Zainab Hassan",
    role: "Community Outreach Lead",
    image: "placeholder.svg",
  },
  {
    name: "Emeka Nwankwo",
    role: "Health Education Coordinator",
    image: "placeholder.svg",
  },
  {
    name: "Fatima Ibrahim",
    role: "Monitoring & Evaluation Lead",
    image: "/placeholder.svg",
  },
  {
    name: "Grace Okafor",
    role: "Communications Officer",
    image: "placeholder.svg",
  },
];

export default function MeetTeamClient() {
  const [stateAmbassadors, setStateAmbassadors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        const res = await fetch("/api/ambassadors");
        const data = await res.json();
        if (Array.isArray(data)) {
          setStateAmbassadors(data);
        }
      } catch (error) {
        console.error("Failed to fetch ambassadors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAmbassadors();
  }, []);

  return (
    <>
      {/* Main Content */}
      <main className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Meet the Team
            </h1>
            <p className="text-foreground/70 text-lg">
              A group of dedicated professionals driven by compassion, purpose,
              and the vision of a healthier Nigeria for all.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-24">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="group p-6 text-center rounded-2xl bg-background/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
                        👤
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-foreground/70">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Ambassadors Section */}
          <div className="mt-20">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full mb-4 tracking-widest uppercase">
                Global Network
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
                LIFELINE STATE <span className="text-primary">AMBASSADORS</span>
              </h2>
              <div className="h-1.5 w-24 bg-primary mx-auto rounded-full" />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">
                  Loading Ambassadors...
                </p>
              </div>
            ) : stateAmbassadors.length === 0 ? (
              <div className="text-center py-20 text-foreground/30 font-bold italic">
                No ambassadors found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stateAmbassadors.map((group, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-8 rounded-[2rem] border-none bg-gradient-to-br from-background to-muted/50 shadow-xl shadow-foreground/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Image
                          src="/placeholder.svg"
                          alt="State Icon"
                          width={100}
                          height={100}
                        />
                      </div>
                      <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {group.state}
                      </h3>
                      <ul className="space-y-4">
                        {group.ambassadors.map((person: any, i: number) => (
                          <li
                            key={i}
                            className="flex items-center gap-4 group/item"
                          >
                            <div className="h-20 w-20 rounded-2xl border-2 border-primary/20 p-1 overflow-hidden transition-all group-hover/item:border-primary shadow-lg shadow-primary/5">
                              <Image
                                src={person.image || "/placeholder.svg"}
                                alt={person.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover rounded-[0.75rem]"
                              />
                            </div>
                            <span className="font-bold text-foreground/80 tracking-tight group-hover/item:text-primary transition-colors">
                              {person.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ✅ CTA Section — placed above the footer */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Whether through donations, volunteering, or partnerships, there are
            many ways to support our work.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/donate">Get Involved</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
