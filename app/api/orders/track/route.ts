import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')?.trim();

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    let order;

    // 1. Try finding by exact ID if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    // 2. If not found or not a valid ObjectId, try finding by suffix (last 8 chars)
    // This allows users to track using the short IDs displayed in the UI
    if (!order) {
      order = await Order.findOne({
        $or: [
          { _id: id }, // In case it's a string ID
          { _id: { $regex: new RegExp(`${id}$`, 'i') } }
        ]
      });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order Track API Error:', error);
    return NextResponse.json({ error: 'Failed to track order' }, { status: 500 });
  }
}
