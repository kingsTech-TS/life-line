"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Handshake,
  TrendingUp,
  Megaphone,
  Briefcase,
  Globe,
  ShieldCheck,
  Users,
  HeartHandshake,
  Stethoscope,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PartnersPage() {
  const containerCurrent = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemCurrent = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32">
        {/* Background Glow */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-black leading-tight text-foreground sm:text-6xl md:text-7xl">
                Create real health <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  impact. Together.
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
                LifeLine partners with brands, organizations, and institutions
                committed to improving access to healthcare in under-resourced
                communities across Nigeria.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full px-8 text-lg font-bold shadow-lg shadow-primary/25 transition hover:shadow-primary/40"
              >
                <Link href="#opportunities">
                  Become a Partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-2 px-8 text-lg font-bold transition hover:bg-muted"
              >
                <Link href="/contact">Talk to the Team</Link>
              </Button>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mx-auto mt-10 max-w-lg text-sm font-semibold text-muted-foreground/70"
            >
              We focus on practical solutions, transparent funding, and
              measurable impact — one state at a time.
            </motion.p>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH US */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Why Partner With Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a movement that prioritizes transparency and tangible
              results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Community-led",
                desc: "Health interventions driven by local needs.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: ShieldCheck,
                title: "Transparent",
                desc: "Every naira tracked through our open ledger.",
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                icon: Megaphone,
                title: "Storytelling",
                desc: "Compelling narratives that amplify your impact.",
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
              {
                icon: Globe,
                title: "Shared Visibility",
                desc: "Co-branded campaigns for maximum reach.",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 h-full border-border/50 bg-background/50 hover:bg-background transition-colors hover:shadow-lg">
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}
                  >
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP OPPORTUNITIES */}
      <section id="opportunities" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <span className="text-primary font-black uppercase tracking-widest text-sm mb-2 block">
              Opportunities
            </span>
            <h2 className="text-4xl md:text-5xl font-black max-w-2xl">
              Ways to Collaborate
            </h2>
          </div>

          <motion.div
            variants={containerCurrent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {[
              {
                item: {
                  label: "Brand Partners",
                  desc: "Support LifeLine through product collaborations and cause-based campaigns.",
                  icon: TrendingUp,
                  cta: "Partner as a Brand",
                },
                gradient: "from-pink-500/20 to-rose-500/20",
                iconColor: "text-rose-500",
              },
              {
                item: {
                  label: "Corporate & NGO Partners",
                  desc: "Sponsor projects, co-create outreach programs, or support community health initiatives.",
                  icon: Briefcase,
                  cta: "Partner as an Organization",
                },
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-500",
              },
              {
                item: {
                  label: "Health & Technical Partners",
                  desc: "Provide expertise, resources, or operational support within the health ecosystem.",
                  icon: Stethoscope,
                  cta: "Partner as a Health Partner",
                },
                gradient: "from-emerald-500/20 to-teal-500/20",
                iconColor: "text-emerald-500",
              },
              {
                item: {
                  label: "Media & Storytelling Partners",
                  desc: "Help amplify impact through content, coverage, and campaign support.",
                  icon: Video,
                  cta: "Partner as Media",
                },
                gradient: "from-violet-500/20 to-purple-500/20",
                iconColor: "text-violet-500",
              },
            ].map((opp, i) => (
              <motion.div key={i} variants={itemCurrent} className="group">
                <div
                  className={`p-10 rounded-[2.5rem] bg-gradient-to-br ${opp.gradient} border border-border/50 h-full flex flex-col hover:scale-[1.01] transition-transform duration-300`}
                >
                  <div className="flex items-start justify-between mb-8">
                    <div
                      className={`p-4 rounded-2xl bg-background ${opp.iconColor}`}
                    >
                      <opp.item.icon size={32} />
                    </div>
                    <ArrowRight
                      className={`w-6 h-6 ${opp.iconColor} opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0`}
                    />
                  </div>

                  <h3 className="text-2xl font-black mb-4">{opp.item.label}</h3>
                  <p className="text-foreground/70 font-medium text-lg mb-8 flex-1">
                    {opp.item.desc}
                  </p>

                  <Button className="w-full h-14 rounded-2xl text-base font-bold bg-background text-foreground hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black border border-foreground/10 shadow-lg">
                    {opp.item.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="py-24 bg-foreground text-background text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <HeartHandshake size={64} className="mx-auto text-primary" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Our Promise
            </h2>
            <div className="space-y-4 text-xl md:text-2xl font-medium opacity-90">
              <p>We commit to clarity, accountability, and impact.</p>
              <p className="text-primary">
                Partners receive transparent reporting and documented results.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* Skewed background for visual dynamic */}
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-8">
              Let’s Build Impact
            </h1>
            <p className="text-xl text-muted-foreground mb-12 font-medium">
              Interested in partnering with LifeLine?
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                asChild
                size="lg"
                className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
              >
                <Link href="#opportunities">Become a Partner</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-full text-lg font-bold border-2 hover:bg-muted hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/contact">Talk to the LifeLine Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
