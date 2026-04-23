import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Vendor from '@/models/Vendor';
import * as jose from 'jose';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await jose.jwtVerify(token, secret);

    await dbConnect();

    // Fetch all orders
    const orders = await Order.find().sort({ createdAt: -1 });

    // Fetch all vendors to map commission rates
    const vendors = await Vendor.find({}, 'businessName commissionRate _id');
    const vendorMap = new Map();
    vendors.forEach(v => {
      vendorMap.set(v._id.toString(), {
        name: v.businessName,
        commissionRate: v.commissionRate || 15
      });
    });

    // Process orders to calculate earnings
    const processedOrders = orders.map(order => {
      let platformEarnings = 0;
      let totalVendorPayout = 0;

      const processedItems = order.items.map((item: any) => {
        const itemTotal = item.price * item.quantity;
        const vendorId = item.vendorId?.toString();
        
        let vendorInfo = vendorMap.get(vendorId);
        let commissionRate = 15; // default
        let isPlatform = false;

        if (vendorId === 'platform' || !vendorId) {
          isPlatform = true;
          platformEarnings += itemTotal; // Platform keeps 100%
        } else if (vendorInfo) {
          commissionRate = vendorInfo.commissionRate;
          const payout = itemTotal * (1 - commissionRate / 100);
          const platformCut = itemTotal * (commissionRate / 100);
          
          totalVendorPayout += payout;
          platformEarnings += platformCut;
        } else {
          // Vendor deleted or unknown
          const payout = itemTotal * (1 - 15 / 100);
          const platformCut = itemTotal * (15 / 100);
          totalVendorPayout += payout;
          platformEarnings += platformCut;
        }

        return {
          ...item.toObject(),
          vendorName: isPlatform ? 'Platform' : (vendorInfo?.name || 'Unknown Vendor'),
          commissionRate: isPlatform ? 100 : commissionRate,
        };
      });

      return {
        _id: order._id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: processedItems,
        platformEarnings,
        totalVendorPayout
      };
    });

    return NextResponse.json(processedOrders);
  } catch (error) {
    console.error('Fetch admin sales error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
