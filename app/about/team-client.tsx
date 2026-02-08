"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
    name: "David Okonkwo",
    role: "Operations Manager",
    image: "placeholder.svg",
  },
  {
    name: "Grace Okafor",
    role: "Communications Officer",
    image: "placeholder.svg",
  },
];

export default function MeetTeamClient() {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
