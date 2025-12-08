export default function CheckoutPage() {
  return (
    <div className="min-h-screen py-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="max-w-xl space-y-6">
        <p className="text-gray-600">
          This is your checkout page.  
          You can extend this with actual payments (Paystack, Flutterwave, Stripe, etc.)
        </p>

        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Customer Information</h2>

          <form className="space-y-4">
            <input
              className="w-full border rounded p-2"
              placeholder="Full Name"
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Email Address"
            />

            <input
              className="w-full border rounded p-2"
              placeholder="Delivery Address"
            />

            <button className="w-full bg-primary text-white rounded p-3 mt-4">
              Complete Order
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
