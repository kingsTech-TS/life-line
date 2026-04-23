import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    const { bankCode, accountNumber, bankName } = await req.json();

    if (!bankCode || !accountNumber || !bankName) {
      return NextResponse.json({ error: 'Missing required bank details' }, { status: 400 });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Paystack secret key is missing' }, { status: 500 });
    }

    await dbConnect();
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Call Paystack to create subaccount
    const response = await fetch('https://api.paystack.co/subaccount', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: vendor.businessName,
        settlement_bank: bankCode,
        account_number: accountNumber,
        percentage_charge: vendor.commissionRate || 15,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Paystack subaccount creation failed:', data);
      return NextResponse.json({ error: data.message || 'Failed to create subaccount' }, { status: 400 });
    }

    // Save subaccount details to vendor
    vendor.paystackSubaccountCode = data.data.subaccount_code;
    vendor.bankName = bankName;
    vendor.accountNumber = accountNumber;
    vendor.bankCode = bankCode;
    await vendor.save();

    return NextResponse.json({
      success: true,
      subaccountCode: vendor.paystackSubaccountCode,
      bankName: vendor.bankName,
      accountNumber: vendor.accountNumber,
    });
  } catch (error: any) {
    console.error('Create subaccount error:', error);
    return NextResponse.json({ error: 'Failed to setup bank account' }, { status: 500 });
  }
}
