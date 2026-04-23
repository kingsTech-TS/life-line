import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch all items, populated with vendor info for display on the shop page
    const items = await ShopItem.find({})
      .populate('vendorId', 'businessName')
      .sort({ createdAt: -1 });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
