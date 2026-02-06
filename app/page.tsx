"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  HeartPlusIcon,
  TrendingUp,
  Zap,
  HandshakeIcon,
  ChevronDown,
  Users,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import DonationsSection from "../components/DonationsSection";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "newsletter_signup", {
          email_provided: !!email,
        });
      }

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Thank you for subscribing!");
        setEmail("");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const faqs = [
    {
      q: "Who’s behind Lifeline?",
      a: "Lifeline is powered by a collective of people and partners committed to building black communities globally.",
    },
    {
      q: "How can I learn more about your governance and legal structure?",
      a: "You can explore our transparency page for governance, financial statements, and structure details.",
    },
    {
      q: "Is Lifeline a registered charity?",
      a: "Yes, Lifeline is a legally registered non-profit organization.",
    },
    {
      q: "How does Lifeline select and vet project partners?",
      a: "We carefully evaluate partners based on credibility, track record, and alignment with our impact goals.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Together, We’re Restoring Hope, One Community at a Time.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8">
              LifeLine by NPHN is a movement of people, brands, and communities
              working hand-in-hand to solve real problems from access to clean
              water to healthcare, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-primary text-white hover:bg-white hover:text-black"
              >
                <Link href="/donate">
                  Join as a Partner <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Support with a Donation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Be Someone’s Lifeline */}
      <DonationsSection />

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            How LifeLine Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {[
              {
                icon: Heart,
                title: "Collaborate",
                description:
                  "We partner with brands creating purposeful products.",
              },
              {
                icon: Users,
                title: "Support",
                description:
                  "You donate or buy these products, knowing every naira goes toward impact.",
              },
              {
                icon: TrendingUp,
                title: "Change Lives",
                description:
                  "Together, we fund projects solving real local problems.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-10 w-full max-w-sm text-center hover:shadow-xl transition-shadow rounded-2xl"
              >
                <item.icon className="h-14 w-14 text-primary mx-auto mb-5" />
                <h3 className="font-semibold text-2xl mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-foreground/80 text-base leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="py-24 bg-muted/50 min-h-[100vh] flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              Why We Exist
            </h2>
            <p className="text-lg text-foreground/80 mb-8">
              Every day, communities across Nigeria face challenges from access
              to clean water to education and healthcare. LifeLine connects
              purpose-driven people, brands, and causes to create local
              solutions for local problems.
            </p>
            <ul className="space-y-4">
              {[
                "Only 40% of rural communities have access to primary healthcare facilities.",
                "Healthcare costs consume 30% of household income for vulnerable populations.",
                "Preventable diseases remain leading causes of death due to lack of awareness.",
              ].map((point, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <p className="text-foreground/80">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How you can help */}
      <section className="py-24 bg-background min-h-[100vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            How you can help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Step 1 - Donate",
                description:
                  "Every contribution, big or small, keeps a heart beating, a child learning, or a community thriving. Your kindness fuels real change.",
                cta: "Donate Now",
                href: "/donate",
              },
              {
                title: "Step 2 - Partner with Us",
                description:
                  "We believe change grows stronger when hands join. Partner with us as a brand, organization, or startup to create meaningful products and campaigns that give life back to those who need it most.",
                cta: "Start a Partnership",
                href: "/partner",
              },
              {
                title: "Step 3 - Be the Voice",
                description:
                  "You don’t always need money to make a difference. Volunteer with our outreach or support team, and be part of the hearts and hands behind every impact story.",
                cta: "Volunteer Now",
                href: "https://forms.gle/cUZqytYsQAY5m2JT6",
                external: true,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-xl mb-4">{item.title}</h3>
                <p className="text-foreground/80 mb-6">{item.description}</p>

                <Button variant="outline" asChild>
                  <Link href={item.href}>{item.cta}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIVE PHILANTHROPY CTA (foot.PNG) */}
      {/* <section className="min-h-[80vh] flex flex-col justify-center items-center bg-muted text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Experience the Power of Collective Philanthropy
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Join the village
          </Button>
          <Button size="lg" variant="outline" className="bg-primary text-white hover:bg-white hover:text-black">
            Make a one-time gift
          </Button>
        </div>
        <p className="text-foreground/70">
          Already a villager?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </section> */}

      {/* OPEN LEDGER SECTION */}
      <section className="min-h-[100vh] flex items-center bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold mb-10 text-foreground">
            Our Open Ledger
          </h2>

          <Button variant="outline" size="lg" className="mb-16">
            View transactions
          </Button>

          <div className="max-w-2xl mx-auto space-y-8 text-left text-lg">
            <div className="flex justify-between items-center border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground text-xl">
                  Our Target
                </span>
              </div>
              <span className="font-bold text-foreground text-xl">$29,438</span>
            </div>

            <div className="flex justify-between items-center border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <HeartPlusIcon className="h-6 w-6 text-secondary" />
                <span className="font-semibold text-foreground text-xl">
                  Your Contributions
                </span>
              </div>
              <span className="font-bold text-foreground text-xl">$10,146</span>
            </div>

            <div className="flex justify-between items-center border-b border-border pb-5">
              <div className="flex items-center gap-3">
                <HandshakeIcon className="h-6 w-6 text-green-600" />
                <span className="font-semibold text-foreground text-xl">
                  Lives Touched
                </span>
              </div>
              <span className="font-bold text-foreground text-xl">1,891</span>
            </div>
          </div>

          <p className="mt-16 text-foreground/80 text-lg">
            Join a growing community of changemakers transforming lives every
            day.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg rounded-xl"
          >
            Get started
          </Button>
        </div>
      </section>

      {/* FAQ SECTION WITH ANIMATION */}
      <section className="min-h-[100vh] py-24 flex items-center bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-10">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-lg overflow-hidden text-left"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex justify-between items-center p-6 font-medium text-lg text-foreground hover:bg-muted/50 transition"
                >
                  {faq.q}
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${openFAQ === i ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFAQ === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-foreground/80">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-foreground/80 mb-6">
              Subscribe to our newsletter for impact stories and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                required
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
