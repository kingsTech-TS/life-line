"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"

const products = [
  {
    id: 1,
    name: "Basic Wellness Kit",
    price: 5000,
    description: "Essential health supplies including vitamins, first aid items, and health education materials.",
    category: "Wellness",
  },
  {
    id: 2,
    name: "Medical Supplies Bundle",
    price: 12000,
    description: "Professional-grade medical equipment for community health centers.",
    category: "Medical",
  },
  {
    id: 3,
    name: "Community Health Program",
    price: 25000,
    description: "Support a full health education program for a community.",
    category: "Programs",
  },
  {
    id: 4,
    name: "Maternal Health Package",
    price: 15000,
    description: "Prenatal care supplies and education for expectant mothers.",
    category: "Maternal Health",
  },
  {
    id: 5,
    name: "Child Nutrition Program",
    price: 8000,
    description: "Nutritional supplements and education for children.",
    category: "Nutrition",
  },
  {
    id: 6,
    name: "Disease Prevention Kit",
    price: 10000,
    description: "Preventive health supplies and vaccination support materials.",
    category: "Prevention",
  },
]

export default function Shop() {
  const [cart, setCart] = useState<number[]>([])

  const addToCart = (productId: number) => {
    setCart([...cart, productId])
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">LifeLine Shop</h1>
            <p className="text-lg text-foreground/80">
              Purchase health products and programs that directly support our mission to bring healthcare to underserved
              communities.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Products</h2>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart size={20} />
              <span>{cart.length} items in cart</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <div className="text-5xl opacity-20">📦</div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <div className="text-xs font-semibold text-primary mb-2">{product.category}</div>
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-foreground/80">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-2xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
                    <Button size="sm" onClick={() => addToCart(product.id)} className="bg-primary hover:bg-primary/90">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Checkout?</h2>
          <p className="text-lg mb-8 opacity-90">
            Proceed to payment to complete your purchase and support our mission.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
