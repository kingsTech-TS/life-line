"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"


export default function DonationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-green-50">
      <div className="max-w-md w-full text-center bg-white shadow-lg p-8 rounded-2xl">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Donation Successful! 🎉
        </h1>

        <p className="text-gray-700 mb-6">
          Thank you for your generous support!  
          Your donation has been processed successfully.
        </p>

        <Link href="/donate">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Make Another Donation
          </Button>
        </Link>

        <Link href="/" className="block mt-4 text-green-700 underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
