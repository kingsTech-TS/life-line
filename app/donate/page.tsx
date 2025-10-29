"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Card } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Button } from "../../components/ui/button"

export default function Donate() {
  const [donationType, setDonationType] = useState("one-time")
  const [amount, setAmount] = useState(5000)
  const [customAmount, setCustomAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [1000, 5000, 10000, 25000, 50000]

  const handleDonate = async () => {
    if (!donorName || !donorEmail) {
      alert("Please fill in your name and email")
      return
    }

    setIsProcessing(true)
    const finalAmount = customAmount ? Number.parseInt(customAmount) : amount

    try {
      // Track donation event
      if (typeof window !== "undefined" && (window as any).gtag) {
        ;(window as any).gtag("event", "donation_initiated", {
          value: finalAmount,
          currency: "NGN",
          donation_type: donationType,
        })
      }

      // Track Meta Pixel event
      if (typeof window !== "undefined" && (window as any).fbq) {
        ;(window as any).fbq("track", "Donate", {
          value: finalAmount / 100,
          currency: "NGN",
        })
      }

      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email: donorEmail,
          metadata: {
            name: donorName,
            type: donationType,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Donation of ₦${finalAmount.toLocaleString()} initiated successfully!`)
        // Reset form
        setDonorName("")
        setDonorEmail("")
        setCustomAmount("")
        setAmount(5000)
      } else {
        alert("Failed to process donation. Please try again.")
      }
    } catch (error) {
      console.error("Donation error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Make a Donation</h1>
            <p className="text-lg text-foreground/80">
              Your generous contribution directly supports healthcare initiatives in underserved communities.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              {/* Donation Type */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Donation Type</h2>
                <RadioGroup value={donationType} onValueChange={setDonationType}>
                  <div className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <label htmlFor="one-time" className="cursor-pointer">
                      One-time Donation
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recurring" id="recurring" />
                    <label htmlFor="recurring" className="cursor-pointer">
                      Monthly Recurring
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Select Amount</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset)
                        setCustomAmount("")
                      }}
                      className={`p-3 rounded-lg border-2 font-semibold transition-colors ${
                        amount === preset && !customAmount
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      ₦{(preset / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Custom Amount</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted text-foreground/60">₦</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value)
                        if (e.target.value) setAmount(0)
                      }}
                      placeholder="Enter custom amount"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                    />
                  </div>
                </div>
              </div>

              {/* Impact Info */}
              <div className="mb-8 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h3 className="font-semibold text-foreground mb-3">Your Impact</h3>
                <ul className="space-y-2 text-sm text-foreground/80">
                  <li>• ₦1,000 provides basic health screening for 5 people</li>
                  <li>• ₦5,000 supplies a community health worker for a week</li>
                  <li>• ₦10,000 funds a health education workshop</li>
                  <li>• ₦25,000 supports maternal health services for a month</li>
                </ul>
              </div>

              {/* Donor Info */}
              <div className="mb-8 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Donor Information</h2>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isProcessing}
              >
                <Heart className="mr-2 h-5 w-5" />
                {isProcessing ? "Processing..." : `Donate ₦${customAmount || amount.toLocaleString()}`}
              </Button>

              <p className="text-xs text-foreground/60 text-center mt-4">
                Your donation is secure and processed through our trusted payment partners.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Why Support LifeLine?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Direct Impact</h3>
              <p className="text-foreground/80">100% of donations go directly to healthcare programs and services.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Transparent Reporting</h3>
              <p className="text-foreground/80">We provide detailed reports on how your funds are utilized.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2">Community-Driven</h3>
              <p className="text-foreground/80">We work with communities to ensure sustainable, lasting change.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
