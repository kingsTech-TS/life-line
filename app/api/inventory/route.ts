import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch all items, usually sorted by newest or category
    const items = await ShopItem.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
