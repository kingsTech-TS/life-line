"use client"

import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"


export default function DonationFailure() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-red-50">
      <div className="max-w-md w-full text-center bg-white shadow-lg p-8 rounded-2xl">
        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Payment Failed ❌
        </h1>

        <p className="text-gray-700 mb-6">
          Your donation could not be completed.  
          Please try again or use another payment method.
        </p>

        <Link href="/donate">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
        </Link>

        <Link href="/" className="block mt-4 text-red-700 underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
