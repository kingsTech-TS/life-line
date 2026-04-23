import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';
import Order from '@/models/Order';
import * as jose from 'jose';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    await dbConnect();

    const totalProducts = await ShopItem.countDocuments({ 
      $or: [
        { vendorId: vendorId },
        { vendorId: mongoose.isValidObjectId(vendorId) ? new mongoose.Types.ObjectId(vendorId) : null }
      ].filter(q => q.vendorId !== null)
    });

    // Get orders for this vendor's products
    const orders = await Order.find({ 
      'items.vendorId': { $in: [vendorId, mongoose.isValidObjectId(vendorId) ? new mongoose.Types.ObjectId(vendorId) : null].filter(v => v !== null) } 
    });
    
    let totalSales = 0;
    let totalEarnings = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        if (item.vendorId?.toString() === vendorId.toString()) {
          const itemTotal = item.price * item.quantity;
          totalSales += itemTotal;
          // Apply commission (default 15% if not found)
          const commission = 15; // In a real app, fetch from vendor model
          totalEarnings += itemTotal * (1 - commission / 100);
        }
      });
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalSales,
      totalEarnings,
      recentOrders: orders.slice(0, 5) // Last 5 orders
    });
  } catch (error) {
    console.error('Vendor stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
