
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About LifeLine</h1>
            <p className="text-lg text-foreground/80">
              Our mission is to ensure that quality healthcare is accessible to every person, regardless of their
              economic status or geographic location.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-foreground/80 mb-4">
                To provide equitable access to quality healthcare services and health education to underserved
                communities across Nigeria, empowering individuals and families to lead healthier lives.
              </p>
              <p className="text-foreground/80">
                We believe that healthcare is a fundamental human right, not a privilege. Through strategic partnerships
                and community engagement, we're building sustainable healthcare solutions.
              </p>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-foreground/80 mb-4">
                A Nigeria where every person has access to affordable, quality healthcare and the knowledge to maintain
                their health and wellbeing.
              </p>
              <p className="text-foreground/80">
                We envision communities where preventable diseases are eliminated, maternal and child health outcomes
                improve, and people can access care without financial hardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Equity",
                description:
                  "We believe healthcare should be accessible to all, regardless of background or resources.",
              },
              {
                title: "Transparency",
                description: "We maintain open communication about our work, impact, and how funds are utilized.",
              },
              {
                title: "Community",
                description: "We work with communities, not for them, ensuring local voices shape our initiatives.",
              },
              {
                title: "Excellence",
                description: "We maintain high standards in all our healthcare services and programs.",
              },
              {
                title: "Sustainability",
                description: "We build long-term solutions that create lasting change in communities.",
              },
              {
                title: "Compassion",
                description: "We approach our work with empathy and genuine care for those we serve.",
              },
            ].map((value, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg text-primary mb-2">{value.title}</h3>
                <p className="text-foreground/80">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Dr. Amara Okafor", role: "Executive Director" },
              { name: "Chioma Adeyemi", role: "Head of Programs" },
              { name: "Tunde Oluwaseun", role: "Finance Director" },
              { name: "Zainab Hassan", role: "Community Outreach Lead" },
            ].map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center text-4xl">
                  👤
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-foreground/80">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Whether through donations, volunteering, or partnerships, there are many ways to support our work.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/donate">Get Involved</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
