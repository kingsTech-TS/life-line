
import Link from "next/link"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

export default function Checkout() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>

              <div className="space-y-6 mb-8">
                <div className="border-b border-border pb-4">
                  <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Basic Wellness Kit</span>
                      <span>₦5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Supplies Bundle</span>
                      <span>₦12,000</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                      <span>Total</span>
                      <span>₦17,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-foreground mb-4">Billing Information</h2>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/50"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="radio" name="payment" defaultChecked className="mr-3" />
                      <span>Paystack</span>
                    </label>
                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="radio" name="payment" className="mr-3" />
                      <span>Flutterwave</span>
                    </label>
                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                      <input type="radio" name="payment" className="mr-3" />
                      <span>Stripe</span>
                    </label>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 mb-4">Complete Payment</Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
