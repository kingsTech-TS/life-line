import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Order from "@/models/Order";
import Vendor from "@/models/Vendor";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const { 
      amount, 
      email, 
      donorName, 
      donationType, 
      projectId, 
      isAnonymous, 
      paymentSource, 
      productName,
      items,
      deliveryAddress
    } = await request.json();

    // Validate inputs
    if (!amount || !email || !donorName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is missing from environment variables");
      return NextResponse.json({ error: "Payment configuration error" }, { status: 500 });
    }

    await dbConnect();

    // Check for dynamic split if it's a shop payment
    let splitParams: any = undefined;

    if (paymentSource === 'shop' && items && items.length > 0) {
      const subaccounts: { subaccount: string, share: number }[] = [];
      
      for (const item of items) {
        if (item.vendorId && item.vendorId !== 'platform') {
          const vendor = await Vendor.findById(item.vendorId);
          if (vendor && vendor.paystackSubaccountCode) {
            const itemTotal = item.price * item.quantity;
            const vendorShare = itemTotal * (1 - (vendor.commissionRate || 15) / 100);
            
            // Paystack expects the flat share in kobo
            const shareInKobo = Math.round(vendorShare * 100);
            
            const existing = subaccounts.find(s => s.subaccount === vendor.paystackSubaccountCode);
            if (existing) {
              existing.share += shareInKobo;
            } else {
              subaccounts.push({
                subaccount: vendor.paystackSubaccountCode,
                share: shareInKobo
              });
            }
          }
        }
      }

      if (subaccounts.length > 0) {
        splitParams = {
          type: "flat",
          bearer: "account", // Platform bears the Paystack processing fees
          subaccounts
        };
      }
    }

    const paystackPayload: any = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      metadata: {
        donorName,
        donationType,
        projectId,
        paymentSource,
        items, // Pass items to metadata for verification
      },
    };

    if (splitParams) {
      paystackPayload.split = splitParams;
    }

    // Initialize Paystack transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paystackPayload),
    });

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack initialization error:", data.message);
      return NextResponse.json({ error: data.message || "Failed to initialize payment" }, { status: 400 });
    }

    const reference = data.data.reference;

    // Create a pending donation record (common for all payments)
    const donation = await Donation.create({
      donorName,
      donorEmail: email,
      amount,
      donationType: donationType || 'one-time',
      paymentReference: reference,
      status: 'pending',
      isAnonymous: isAnonymous || false,
      projectId,
      paymentSource: paymentSource || 'donation',
      productName: productName || undefined,
    });

    // If it's a shop order, also create a pending Order record
    if (paymentSource === 'shop' && items && items.length > 0) {
      await Order.create({
        items: items.map((item: any) => ({
          productId: item.id,
          vendorId: item.vendorId || 'platform', // Use 'platform' if no vendor
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variants: item.variants,
          image: item.image,
        })),
        customerId: email, // Use email as ID for now or find user ID
        customerName: donorName,
        customerEmail: email,
        deliveryAddress: deliveryAddress || 'No address provided',
        totalAmount: amount,
        status: 'pending',
        paymentReference: reference, // We should add this field to Order model
      });
    }

    console.log("[Payment] Initialization:", {
      donationId: donation._id,
      email,
      reference,
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
