"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Card } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Button } from "../../components/ui/button"

export default function Donate() {
  const [donationType, setDonationType] = useState("one-time")
  const router = useRouter()
  const [amount, setAmount] = useState(5000)
  const [customAmount, setCustomAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [1000, 5000, 10000, 25000, 50000]

  const handleDonate = () => {
    if (!donorName || !donorEmail) {
      alert("Please fill in your name and email")
      return
    }

    const finalAmount = customAmount ? parseInt(customAmount) : amount

    setIsProcessing(true)

    if (!(window as any).PaystackPop) {
      alert("Paystack is not loaded")
      setIsProcessing(false)
      return
    }

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: donorEmail,
      amount: finalAmount * 100, // Paystack expects kobo
      metadata: {
        custom_fields: [
          {
            display_name: donorName,
            donation_type: donationType,
          },
        ],
      },
      callback: function (response: any) {
        router.push(`/donate/success?ref=${response.reference}`)
      },
      onClose: function () {
        router.push("/donate/failure")
      },
    })

    handler.openIframe()
    setIsProcessing(false)
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
    </main>
  )
}
