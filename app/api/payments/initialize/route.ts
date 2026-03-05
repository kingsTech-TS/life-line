import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const { amount, email, donorName, donationType, projectId, isAnonymous } = await request.json();

    // Validate inputs
    if (!amount || !email || !donorName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is missing from environment variables");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    await dbConnect();

    // Initialize Paystack transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        metadata: {
          donorName,
          donationType,
          projectId,
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack initialization error:", data.message);
      return NextResponse.json({ error: data.message || "Failed to initialize payment" }, { status: 400 });
    }

    // Create a pending donation record in the database
    const donation = await Donation.create({
      donorName,
      donorEmail: email,
      amount,
      donationType: donationType || 'one-time',
      paymentReference: data.data.reference,
      status: 'pending',
      isAnonymous: isAnonymous || false,
      projectId,
    });

    console.log("[Payment] Initialization:", {
      donationId: donation._id,
      email,
      reference: data.data.reference,
    });

    return NextResponse.json(
      {
        success: true,
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
        amount,
        email,
        message: "Payment initialized successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Payment] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to initialize payment" }, { status: 500 });
  }
}
