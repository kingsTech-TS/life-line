import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

async function getVendorFromToken(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('vendor_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const vendorPayload = await getVendorFromToken(req);
    if (!vendorPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { businessName, email, phone, address, bankName, accountNumber, bankCode } = await req.json();
    await dbConnect();

    const updateData: any = {};
    if (businessName) updateData.businessName = businessName;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (bankName) updateData.bankName = bankName;
    if (accountNumber) updateData.accountNumber = accountNumber;
    if (bankCode) updateData.bankCode = bankCode;

    const vendor = await Vendor.findByIdAndUpdate(vendorPayload.id, updateData, { new: true });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vendor });
  } catch (error) {
    console.error('Failed to update vendor profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
