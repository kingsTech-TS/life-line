import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('user_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { cart } = await req.json();

    await dbConnect();
    await User.findByIdAndUpdate(decoded.id, { cart });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
