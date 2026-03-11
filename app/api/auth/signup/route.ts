import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      cart: []
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        cart: user.cart
      } 
    });
    
    response.cookies.set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
