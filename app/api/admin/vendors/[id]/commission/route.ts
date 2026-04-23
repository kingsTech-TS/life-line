import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await jose.jwtVerify(token, secret);

    const vendorId = params.id;
    const { commissionRate } = await req.json();

    if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json({ error: 'Invalid commission rate. Must be between 0 and 100.' }, { status: 400 });
    }

    await dbConnect();

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { commissionRate },
      { new: true }
    );

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor });
  } catch (error) {
    console.error('Update vendor commission error:', error);
    return NextResponse.json({ error: 'Failed to update commission' }, { status: 500 });
  }
}
