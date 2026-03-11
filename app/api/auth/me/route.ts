import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('user_token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    await dbConnect();

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart
      } 
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null });
  }
}
