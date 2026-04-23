import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Order from "@/models/Order";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    // Read secret key fresh each request (not cached at module level)
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
      console.error("[Payment] PAYSTACK_SECRET_KEY is missing");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    await dbConnect();

    // Call Paystack to verify the transaction
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        // Prevent caching so every verification is fresh
        cache: "no-store",
      }
    );

    const paystackData = await paystackRes.json();

    console.log("[Payment] Paystack verify response:", {
      reference,
      status: paystackData?.data?.status,
      message: paystackData?.message,
    });

    // Paystack returns status "success" inside data for a paid transaction
    const paymentSuccessful =
      paystackData.status === true && paystackData.data?.status === "success";

    if (!paymentSuccessful) {
      // Mark as failed in the database
      await Donation.findOneAndUpdate(
        { paymentReference: reference },
        { status: "failed" },
        { new: true }
      );
      
      await Order.findOneAndUpdate(
        { paymentReference: reference },
        { status: "cancelled" }
      );

      return NextResponse.json(
        {
          success: false,
          status: "failed",
          message: paystackData?.message || "Payment was not successful",
        },
        { status: 200 } // Use 200 so the client can read the JSON body easily
      );
    }

    // Payment confirmed — update the DB record to completed with full details
    const donation = await Donation.findOneAndUpdate(
      { paymentReference: reference },
      {
        status: "completed",
        paymentMethod: paystackData.data.channel,
        paymentDetails: {
          authorization: paystackData.data.authorization,
          customer: paystackData.data.customer,
          ip: paystackData.data.ip_address,
          paidAt: paystackData.data.paid_at,
        },
      },
      { new: true }
    );

    // Also update order if it exists
    await Order.findOneAndUpdate(
      { paymentReference: reference },
      { status: "processing" } // Mark as processing once paid
    );

    if (!donation) {
      // Donation record missing in DB — still return success with Paystack data
      console.warn(`[Payment] Donor record not found in DB for reference: ${reference}`);
      return NextResponse.json({
        success: true,
        status: "completed",
        reference,
        // Reconstruct basic data from Paystack response so the UI can display it
        donation: {
          donorName: paystackData.data.metadata?.custom_fields?.find(
            (f: any) => f.variable_name === "donor_name"
          )?.value || paystackData.data.customer?.first_name || "Donor",
          donorEmail: paystackData.data.customer?.email || "",
          amount: paystackData.data.amount / 100, // Paystack returns in kobo
          paymentReference: reference,
          paymentMethod: paystackData.data.channel,
          donationType: "one-time",
          createdAt: paystackData.data.paid_at || new Date().toISOString(),
        },
      });
    }

    console.log("[Payment] Verification Success:", { reference, donationId: donation._id });

    return NextResponse.json({
      success: true,
      status: "completed",
      reference,
      donation: donation.toObject(),
    });
  } catch (error: any) {
    console.error("[Payment] Verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
