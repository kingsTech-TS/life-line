
import Link from "next/link"
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
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Impact Stories</h1>
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

      {/* Stories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
