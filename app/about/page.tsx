"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import MeetTeamClient from "./team-client";

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About LifeLine
          </h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Our mission is to ensure that quality healthcare is accessible to
            every person, regardless of their economic status or geographic
            location.
          </p>
        </div>
      </section>

      {/* About Lifeline */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About LifeLine
            </h2>
            <p>
              LifeLine is a pioneering healthcare non-profit organization
              dedicated to bringing quality healthcare services to underserved
              communities across Nigeria. Since our inception, we have been
              committed to eliminating health inequalities and ensuring that
              every individual, regardless of their economic status, has access
              to affordable and quality healthcare.
            </p>
            <p>
              Our organization operates through a combination of direct service
              delivery, community health worker training, and strategic
              partnerships with governmental and international organizations. We
              focus on preventable diseases, maternal health, child health, and
              health education as our primary intervention areas.
            </p>
            <p>
              With operations in 25+ communities across Nigeria, we have
              directly impacted over 50,000 lives and trained 100+ community
              health workers who continue to serve their communities every day.
            </p>
          </div>

          {/* Image */}
          <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="placeholder.svg"
              alt="About LifeLine"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* About NPHN */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-md order-1 md:order-none">
            <Image
              src="placeholder.svg"
              alt="About NPHN"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About NPHN
            </h2>
            <p>
              The Nigerian Primary Healthcare Network (NPHN) is a coalition of
              healthcare organizations and professionals working together to
              strengthen primary healthcare delivery across Nigeria. LifeLine is
              a proud member and advocate of NPHN's mission.
            </p>
            <p>
              Through our partnership with NPHN, we collaborate on policy
              advocacy, knowledge sharing, and coordinated healthcare delivery
              programs. This partnership amplifies our impact and ensures our
              work aligns with national health priorities.
            </p>
            <p>
              Our collaboration with NPHN strengthens the healthcare ecosystem
              and helps create sustainable, community-centered solutions to
              health challenges in Nigeria.
            </p>
          </div>
        </div>
      </section>

      <MeetTeamClient />

      {/* CTA */}
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
    </main>
  );
}
