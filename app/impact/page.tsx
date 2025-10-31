"use client"

import type React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

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
  const searchParams = useSearchParams()
  const activeSection = searchParams.get("section") || "impact-report"

  const sections: Record<string, React.ReactNode> = {
    "impact-report": (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Impact Report</h2>
            <p className="text-foreground/80 mb-4">
              Our annual impact report provides comprehensive data on the lives we've touched, communities we've served,
              and the real change we're creating across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="text-2xl font-bold text-primary mb-4">2024 Highlights</h3>
              <ul className="space-y-3">
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>50,000+ lives directly impacted</span>
                </li>
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>25+ communities served across Nigeria</span>
                </li>
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>100+ healthcare workers trained</span>
                </li>
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>60% increase in disease prevention awareness</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-secondary/5 to-primary/5">
              <h3 className="text-2xl font-bold text-secondary mb-4">Programmatic Focus</h3>
              <ul className="space-y-3">
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-secondary font-bold">→</span>
                  <span>Maternal & Child Health</span>
                </li>
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-secondary font-bold">→</span>
                  <span>Community Health Worker Programs</span>
                </li>
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-secondary font-bold">→</span>
                  <span>Health Education & Awareness</span>
                </li>
                <li className="text-foreground/80 flex gap-2">
                  <span className="text-secondary font-bold">→</span>
                  <span>Emergency Response Services</span>
                </li>
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
    ),
    donations: (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Donations Impact</h2>
            <p className="text-foreground/80 mb-8">
              Every donation directly supports our programs and brings us closer to our mission of equitable healthcare
              access.
            </p>

            <div className="space-y-6 mb-12">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">₦5,000 Impact</h3>
                <p className="text-foreground/80">
                  Provides basic health screening for 20 people in remote communities
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">₦25,000 Impact</h3>
                <p className="text-foreground/80">Trains and supports one community health worker for a month</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">₦100,000 Impact</h3>
                <p className="text-foreground/80">
                  Establishes a mobile health clinic that serves 500+ community members
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">₦500,000+ Impact</h3>
                <p className="text-foreground/80">
                  Implements a complete community health program serving 5,000+ people annually
                </p>
              </Card>
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
        </div>
      </section>
    ),
    projects: (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Our Current Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Maternal Health Initiative",
                description:
                  "Providing prenatal care, safe delivery services, and postpartum support across 8 communities",
                status: "Active",
                beneficiaries: "2,000+ women",
              },
              {
                name: "Community Health Worker Training",
                description:
                  "Training and equipping local health workers to provide essential services in their communities",
                status: "Active",
                beneficiaries: "100+ workers",
              },
              {
                name: "Child Nutrition Program",
                description: "Addressing childhood malnutrition through nutrition support and health education",
                status: "Active",
                beneficiaries: "5,000+ children",
              },
              {
                name: "Disease Prevention Campaign",
                description: "Health education and vaccination drives in underserved rural areas",
                status: "Active",
                beneficiaries: "15,000+ people",
              },
              {
                name: "Emergency Health Response",
                description: "Rapid response medical teams ready for disaster and emergency situations",
                status: "On-Demand",
                beneficiaries: "2,000+ per incident",
              },
              {
                name: "Health Education Centers",
                description: "Community centers providing health information and basic services",
                status: "Expansion",
                beneficiaries: "10,000+ annually",
              },
            ].map((project, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">{project.name}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {project.status}
                  </span>
                </div>
                <p className="text-foreground/80 mb-4">{project.description}</p>
                <p className="text-sm text-foreground/60">
                  <strong>Beneficiaries:</strong> {project.beneficiaries}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    ),
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Impact</h1>
            <p className="text-lg text-foreground/80">
              Real stories of lives changed through accessible healthcare and community support.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-12 md:py-16 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">50K+</div>
              <p className="text-sm md:text-base opacity-80">Lives Impacted</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">25+</div>
              <p className="text-sm md:text-base opacity-80">Communities Served</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">100+</div>
              <p className="text-sm md:text-base opacity-80">Healthcare Workers Trained</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">60%</div>
              <p className="text-sm md:text-base opacity-80">Disease Prevention Increase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Navigation */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto py-4">
            {[
              { id: "impact-report", label: "Our Impact Report" },
              { id: "donations", label: "Donations" },
              { id: "projects", label: "Projects" },
            ].map((tab) => (
              <Link
                key={tab.id}
                href={`/impact?section=${tab.id}`}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${
                  activeSection === tab.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      {sections[activeSection]}

      {/* Stories Section - shown on impact-report tab */}
      {activeSection === "impact-report" && (
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Impact Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{story.title}</h3>
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
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of These Stories</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
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
