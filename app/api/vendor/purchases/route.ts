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
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    await dbConnect();
    
    // Get vendor's current commission rate
    const vendor = await Vendor.findById(vendorId);
    const commissionRate = vendor?.commissionRate || 15;
    
    // Find orders that contain items from this vendor
    // Robust query checking both string and ObjectId
    const orders = await Order.find({ 
      $or: [
        { 'items.vendorId': vendorId },
        { 'items.vendorId': new mongoose.Types.ObjectId(vendorId) }
      ]
    }).sort({ createdAt: -1 });

    // For each order, only return the items that belong to this vendor
    const vendorSales = orders.map(order => {
      const vendorItems = order.items.filter((item: any) => 
        item.vendorId?.toString() === vendorId.toString()
      );
      
      const rawTotal = vendorItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      const vendorTotal = rawTotal * (1 - commissionRate / 100);
      
      return {
        _id: order._id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        deliveryAddress: order.deliveryAddress,
        items: vendorItems,
        vendorTotal,
        status: order.status,
        createdAt: order.createdAt
      };
    });

    return NextResponse.json({
      sales: vendorSales,
      commissionRate
    });
  } catch (error) {
    console.error('Fetch vendor sales error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
