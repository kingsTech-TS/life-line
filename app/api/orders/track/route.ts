import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();

    // 1. Instant validation to prevent unnecessary processing/latency
    if (!id || id.length < 3) {
      return NextResponse.json(
        { error: id ? 'Order ID too short' : 'Order ID is required' }, 
        { status: 400 }
      );
    }

    // 2. Connect only after validation passes
    await dbConnect();
    
    let order;

    // 3. Try finding by exact ID if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }

    // 4. Try finding by Payment Reference (often used by users)
    if (!order) {
      order = await Order.findOne({ paymentReference: id }); 
    }

    // 5. Try finding by short ID (last characters) with safety
    if (!order) {
      // Escape special characters for regex safety
      const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      order = await Order.findOne({
        _id: { $regex: new RegExp(`${escapedId}$`, 'i') }
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
