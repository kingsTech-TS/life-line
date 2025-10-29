
import Link from "next/link"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function Partners() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Partners</h1>
            <p className="text-lg text-foreground/80">
              We work with organizations and institutions committed to improving healthcare access.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Global Health Initiative", category: "International NGO" },
              { name: "Nigerian Medical Association", category: "Professional Body" },
              { name: "Community Development Fund", category: "Funding Partner" },
              { name: "Tech for Good Africa", category: "Technology Partner" },
              { name: "University Teaching Hospital", category: "Healthcare Partner" },
              { name: "Women's Empowerment Network", category: "Community Partner" },
            ].map((partner, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center text-2xl">
                  🤝
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{partner.name}</h3>
                <p className="text-sm text-foreground/80">{partner.category}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            Partnership Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">Corporate Partnerships</h3>
              <p className="text-foreground/80 mb-4">
                Align your brand with our mission and create meaningful impact in communities.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/contact">Learn More</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">NGO Collaborations</h3>
              <p className="text-foreground/80 mb-4">
                Join forces with us to amplify our reach and impact in healthcare delivery.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/contact">Learn More</Link>
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-foreground mb-3">Government Partnerships</h3>
              <p className="text-foreground/80 mb-4">
                Work with us to strengthen healthcare systems at the community level.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/contact">Learn More</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Interested in Partnering?</h2>
          <p className="text-lg mb-8 opacity-90">Let's work together to create lasting change in healthcare access.</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
