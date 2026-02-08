"use client"

import type React from "react"
import Link from "next/link"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { useState, useEffect } from "react"

const stories = [
  {
    id: 1,
    title: "Amara's Second Chance",
    community: "Lekki Community, Lagos",
    description:
      "Through our maternal health program, Amara received prenatal care and delivered safely. Today, she's a healthy mother of a beautiful baby girl.",
    impact: "Maternal Health",
  },
  {
    id: 2,
    title: "The Village That Got Healthcare",
    community: "Oyo State Rural Area",
    description:
      "A remote village now has access to basic healthcare services thanks to our community health worker program. Preventable diseases have decreased by 60%.",
    impact: "Community Health",
  },
  {
    id: 3,
    title: "Chioma's Dream",
    community: "Enugu State",
    description:
      "Chioma was trained as a community health worker through our program. She now serves 500+ people in her community and earns a sustainable income.",
    impact: "Economic Empowerment",
  },
  {
    id: 4,
    title: "Disease Prevention Success",
    community: "Multiple Communities",
    description:
      "Our health education campaigns reached 10,000+ people, resulting in a 45% increase in vaccination rates and disease awareness.",
    impact: "Health Education",
  },
  {
    id: 5,
    title: "Emergency Response",
    community: "Flood-Affected Areas",
    description:
      "During the recent floods, our rapid response team provided emergency medical care to 2,000+ displaced persons.",
    impact: "Emergency Response",
  },
  {
    id: 6,
    title: "Child Nutrition Program",
    community: "Lagos & Ogun States",
    description:
      "Over 5,000 children now receive nutritional support, resulting in improved health outcomes and school attendance.",
    impact: "Child Health",
  },
]

export default function Impact() {
  const [impactStories, setImpactStories] = useState<any[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("/api/impact");
        const data = await response.json();
        const mappedStories = data.map((story: any) => ({
          id: story._id,
          title: story.title,
          description: story.description,
          impact: story.tags[0] || "General Impact",
          community: "LifeLine Community", // Placeholder as it's not in the model
        }));
        setImpactStories(mappedStories);
      } catch (error) {
        console.error("Failed to fetch impact stories:", error);
      }
    };

    fetchStories();
  }, []);
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Impact Report</h1>
          <p className="text-lg text-foreground/80">
            Our annual impact report provides comprehensive data on the lives we've touched, communities we've served, and the real change we're creating across Nigeria.
          </p>
        </div>
      </section>


      {/* Impact Report */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-2xl font-bold text-primary mb-4">2024 Highlights</h3>
              <ul className="space-y-3 text-foreground/80">
                <li>✓ 50,000+ lives directly impacted</li>
                <li>✓ 25+ communities served across Nigeria</li>
                <li>✓ 100+ healthcare workers trained</li>
                <li>✓ 60% increase in disease prevention awareness</li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
              <h3 className="text-2xl font-bold text-secondary mb-4">Programmatic Focus</h3>
              <ul className="space-y-3 text-foreground/80">
                <li>→ Maternal & Child Health</li>
                <li>→ Community Health Worker Programs</li>
                <li>→ Health Education & Awareness</li>
                <li>→ Emergency Response Services</li>
              </ul>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <a href="#" download>
                Download Full Report (PDF)
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Donations Impact */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Donations Impact</h2>
          <p className="text-foreground/80 text-center mb-12 max-w-2xl mx-auto">
            Every donation directly supports our programs and brings us closer to our mission of equitable healthcare access.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: "₦5,000", text: "Provides basic health screening for 20 people" },
              { title: "₦25,000", text: "Trains and supports one community health worker for a month" },
              { title: "₦100,000", text: "Establishes a mobile clinic serving 500+ members" },
              { title: "₦500,000+", text: "Implements a community health program for 5,000+ people" },
            ].map((don, i) => (
              <Card key={i} className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{don.title} Impact</h3>
                <p className="text-foreground/80">{don.text}</p>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <p className="text-foreground/80 mb-4">
              <strong>100% of donations go directly to programs.</strong> We maintain minimal operational costs
              through partnerships and volunteer support.
            </p>
            <Button asChild size="lg">
              <Link href="/donate">Make a Donation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Current Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {[
              {
                name: "Maternal Health Initiative",
                description: "Providing prenatal care, safe delivery, and postpartum support across 8 communities",
                status: "Active",
                beneficiaries: "2,000+ women",
              },
              {
                name: "Community Health Worker Training",
                description: "Training and equipping local health workers for essential services",
                status: "Active",
                beneficiaries: "100+ workers",
              },
              {
                name: "Child Nutrition Program",
                description: "Addressing malnutrition through nutrition support and education",
                status: "Active",
                beneficiaries: "5,000+ children",
              },
              {
                name: "Disease Prevention Campaign",
                description: "Vaccination and education drives in underserved rural areas",
                status: "Active",
                beneficiaries: "15,000+ people",
              },
            ].map((project, i) => (
              <Card key={i} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {project.status}
                  </span>
                </div>
                <p className="text-foreground/80 mb-2">{project.description}</p>
                <p className="text-sm text-foreground/60">
                  <strong>Beneficiaries:</strong> {project.beneficiaries}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Impact Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactStories.map((story) => (
              <Card key={story.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{story.title}</h3>
                    <p className="text-sm text-foreground/60">{story.community}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {story.impact}
                  </span>
                </div>
                <p className="text-foreground/80">{story.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of These Stories</h2>
          <p className="text-lg mb-8 opacity-90">
            Your support creates real change in real communities. Join us in building a healthier Nigeria.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
