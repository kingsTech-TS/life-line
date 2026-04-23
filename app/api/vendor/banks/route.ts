import { NextResponse } from 'next/server';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET() {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Paystack secret key is missing' }, { status: 500 });
    }

    const response = await fetch('https://api.paystack.co/bank?country=nigeria', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json(data.data);
  } catch (error: any) {
    console.error('Fetch banks error:', error);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}
