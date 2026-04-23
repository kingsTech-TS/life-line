import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const vendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (!vendor) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!vendor.isApproved) {
      return NextResponse.json({ error: 'Your account is pending approval. Please wait for the admin to approve your vendor account before listing products.' }, { status: 403 });
    }

    const token = jwt.sign(
      { id: vendor._id, email: vendor.email, businessName: vendor.businessName, role: 'vendor' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ 
      success: true, 
      vendor: { 
        id: vendor._id, 
        businessName: vendor.businessName, 
        email: vendor.email,
        role: 'vendor'
      } 
    });
    
    response.cookies.set('vendor_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Vendor login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
