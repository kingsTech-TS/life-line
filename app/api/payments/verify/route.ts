import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Order from "@/models/Order";
import ShopItem from "@/models/ShopItem";
import { createNotification, notifyAdmins } from "@/lib/notifications";

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

    if (donation && donation.amount > 0) {
      await notifyAdmins({
        title: 'New Donation Received',
        message: `A new donation of ₦${donation.amount.toLocaleString()} has been received from ${donation.donorName}.`,
        type: 'payment',
        link: '/admin/donations'
      });
    }

    // Also update order if it exists
    const order = await Order.findOneAndUpdate(
      { paymentReference: reference },
      { status: "processing" }, // Mark as processing once paid
      { new: true }
    );

    if (order) {
      // Notify vendors and update stock
      const vendorsNotified = new Set();
      
      for (const item of order.items) {
        // Decrement stock
        try {
          const product = await ShopItem.findById(item.productId);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();

            // Notify for low stock
            if (product.stock <= 5) {
              await createNotification({
                recipientId: item.vendorId,
                recipientType: 'vendor',
                title: 'Low Stock Alert',
                message: `Your item "${product.name}" is running low on stock (${product.stock} left).`,
                type: 'stock',
                link: '/vendor/products'
              });
            } else if (product.stock === 0) {
              await createNotification({
                recipientId: item.vendorId,
                recipientType: 'vendor',
                title: 'Out of Stock',
                message: `Your item "${product.name}" is out of stock.`,
                type: 'stock',
                link: '/vendor/products'
              });
            }
          }
        } catch (stockErr) {
          console.error("Stock update error:", stockErr);
        }

        // Check if it's an admin product or vendor product
        if (!item.vendorId || item.vendorId === 'platform') {
          // Admin product purchase
          await notifyAdmins({
            title: 'Admin Product Sold',
            message: `Your product "${item.name}" was purchased by ${order.customerName}.`,
            type: 'order',
            link: '/admin/shop'
          });
        } else {
          // Vendor product - notify admin about commission
          const commission = (item.price * item.quantity) * (order.commissionRate / 100);
          await notifyAdmins({
            title: 'Commission Received',
            message: `Platform received ₦${commission.toLocaleString()} commission from ${item.name} sale by a vendor.`,
            type: 'payment',
            link: '/admin/vendors'
          });

          // Notify vendor about new order
          if (!vendorsNotified.has(item.vendorId)) {
            await createNotification({
              recipientId: item.vendorId,
              recipientType: 'vendor',
              title: 'New Order Received',
              message: `You have received a new order for ${order.customerName}.`,
              type: 'order',
              link: `/vendor/purchases`
            });

            // Also notify about payment (simplified as the platform handles payout)
            await createNotification({
              recipientId: item.vendorId,
              recipientType: 'vendor',
              title: 'Payment Confirmed',
              message: `Payment for order ${reference} has been confirmed and is being processed for your sub-account.`,
              type: 'payment',
              link: '/vendor/purchases'
            });

            vendorsNotified.add(item.vendorId);
          }
        }
      }
    }

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
