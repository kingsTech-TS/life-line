"use client"

import Image from "next/image"
import Link from "next/link"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About LifeLine</h1>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Our mission is to ensure that quality healthcare is accessible to every person,
            regardless of their economic status or geographic location.
          </p>
        </div>
      </section>

      {/* About Lifeline */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About LifeLine</h2>
            <p>
              LifeLine is a pioneering healthcare non-profit organization dedicated to bringing
              quality healthcare services to underserved communities across Nigeria. Since our
              inception, we have been committed to eliminating health inequalities and ensuring that
              every individual, regardless of their economic status, has access to affordable and
              quality healthcare.
            </p>
            <p>
              Our organization operates through a combination of direct service delivery, community
              health worker training, and strategic partnerships with governmental and international
              organizations. We focus on preventable diseases, maternal health, child health, and
              health education as our primary intervention areas.
            </p>
            <p>
              With operations in 25+ communities across Nigeria, we have directly impacted over
              50,000 lives and trained 100+ community health workers who continue to serve their
              communities every day.
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About NPHN</h2>
            <p>
              The Nigerian Primary Healthcare Network (NPHN) is a coalition of healthcare
              organizations and professionals working together to strengthen primary healthcare
              delivery across Nigeria. LifeLine is a proud member and advocate of NPHN's mission.
            </p>
            <p>
              Through our partnership with NPHN, we collaborate on policy advocacy, knowledge
              sharing, and coordinated healthcare delivery programs. This partnership amplifies our
              impact and ensures our work aligns with national health priorities.
            </p>
            <p>
              Our collaboration with NPHN strengthens the healthcare ecosystem and helps create
              sustainable, community-centered solutions to health challenges in Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dr. Amara Okafor", role: "Executive Director" },
              { name: "Chioma Adeyemi", role: "Head of Programs" },
              { name: "Tunde Oluwaseun", role: "Finance Director" },
              { name: "Zainab Hassan", role: "Community Outreach Lead" },
              { name: "Emeka Nwankwo", role: "Health Education Coordinator" },
              { name: "Fatima Ibrahim", role: "Monitoring & Evaluation Lead" },
              { name: "David Okonkwo", role: "Operations Manager" },
              { name: "Grace Okafor", role: "Communications Officer" },
            ].map((member, index) => (
              <Card
                key={index}
                className="p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4 flex items-center justify-center text-3xl">
                  👤
                </div>
                <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                <p className="text-sm text-foreground/70">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Exist */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center md:text-left">
            Why We Exist
          </h2>
          <div className="max-w-7xl mx-auto space-y-4 text-foreground/80 leading-relaxed">
            <p>
              LifeLine exists because healthcare is a fundamental human right, not a privilege. In
              Nigeria, millions of people lack access to basic healthcare services, leading to
              preventable deaths and suffering. This is not inevitable—it's a choice that can be
              changed through dedicated effort and community-centered action.
            </p>
            <p>We exist to bridge the healthcare gap. We believe that:</p>
            <ul className="space-y-3 mb-6 list-none">
              {[
                "Every person deserves access to quality healthcare regardless of their economic status.",
                "Communities must be at the center of healthcare solutions.",
                "Prevention is more powerful than cure.",
                "Education empowers people to take control of their health.",
                "Sustainable change requires partnership and collaboration.",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p>
              We exist to transform these beliefs into action and create a healthier, more equitable
              Nigeria for all.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary text-primary-foreground text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 opacity-90">
            Whether through donations, volunteering, or partnerships, there are many ways to support
            our work.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/donate">Get Involved</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
