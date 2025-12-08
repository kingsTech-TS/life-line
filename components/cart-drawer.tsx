"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./ui/button"

export default function CartDrawer({ open, onClose, items, products, onRemove }: any) {
  const total = items.reduce((sum: number, id: number) => {
    const product = products.find((p: any) => p.id === id)
    return sum + (product?.price || 0)
  }, 0)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 80 }}
        className="fixed top-0 right-0 w-80 md:w-96 h-full bg-white shadow-xl z-50 p-6 flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((id: number, index: number) => {
              const product = products.find((p: any) => p.id === id)
              return (
                <div
                  key={index}
                  className="p-3 border rounded-md flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{product?.name}</h3>
                    <p className="text-sm text-gray-600">₦{product?.price.toLocaleString()}</p>
                  </div>

                  {/* Remove / Cancel Button */}
                  <button
                    onClick={() => onRemove(id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span>₦{total.toLocaleString()}</span>
          </div>

          <Button className="w-full" asChild>
            <a href="/checkout">Proceed to Checkout</a>
          </Button>
        </div>
      </motion.div>
    </>
  )
}
