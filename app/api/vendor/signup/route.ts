import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const { businessName, email, password, phone, address } = await req.json();
    
    if (!businessName || !email || !password || !phone || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const existingVendor = await Vendor.findOne({ email: email.toLowerCase() });
    if (existingVendor) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const vendor = await Vendor.create({
      businessName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      commissionRate: 15, // Default commission
      isApproved: false,   // Must be approved by admin before listing products
    });

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
    console.error('Vendor signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
