"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Heart, Users, TrendingUp, Zap } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"

export default function Home() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "newsletter_signup", {
          email_provided: !!email,
        })
      }

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        alert("Thank you for subscribing!")
        setEmail("")
      } else {
        alert("Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Quality Healthcare for Every Community
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 text-balance">
              LifeLine brings accessible, affordable healthcare and wellness solutions to underserved communities across
              Nigeria. Together, we're building a healthier future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/donate">
                  Donate Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      
      {/* <section className="py-12 md:py-16 bg-foreground text-background">
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
              <p className="text-sm md:text-base opacity-80">Healthcare Workers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">₦2.5B</div>
              <p className="text-sm md:text-base opacity-80">Funds Distributed</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Problem Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">The Challenge We're Addressing</h2>
            <p className="text-lg text-foreground/80 mb-6">
              Millions of people in underserved communities lack access to basic healthcare. Limited resources,
              inadequate infrastructure, and geographic barriers create a healthcare crisis that demands immediate
              action.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <p className="text-foreground/80">
                  Only 40% of rural communities have access to primary healthcare facilities
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <p className="text-foreground/80">
                  Healthcare costs consume 30% of household income for vulnerable populations
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <p className="text-foreground/80">
                  Preventable diseases remain leading causes of death due to lack of awareness
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">How LifeLine Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Donate",
                description: "Contribute to our mission through one-time or recurring donations",
              },
              {
                icon: Users,
                title: "Empower",
                description: "Your funds support local healthcare workers and community leaders",
              },
              { icon: TrendingUp, title: "Scale", description: "We expand services to reach more communities in need" },
              { icon: Zap, title: "Impact", description: "Real lives are changed through accessible healthcare" },
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/80">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/shop">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Wellness Kit", price: "₦5,000", description: "Essential health supplies for families" },
              {
                name: "Medical Supplies Bundle",
                price: "₦12,000",
                description: "Professional-grade medical equipment",
              },
              {
                name: "Community Health Program",
                price: "₦25,000",
                description: "Support a full health education program",
              },
            ].map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-6xl opacity-20">📦</div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-foreground/80 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{product.price}</span>
                    <Button asChild size="sm">
                      <Link href="/shop">View</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of supporters bringing quality healthcare to underserved communities. Every contribution
            matters.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/donate">Donate Now</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-foreground/80 mb-6">Subscribe to our newsletter for impact stories and updates.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubscribing}>
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
