import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('user_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await dbConnect();

    // Fetch orders for this customer
    const orders = await Order.find({ customerId: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('My Orders API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
