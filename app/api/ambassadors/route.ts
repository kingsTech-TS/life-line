import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ambassador from '@/models/Ambassador';

export async function GET() {
  try {
    await dbConnect();
    const ambassadors = await Ambassador.find({}).sort({ state: 1, name: 1 });
    
    // Group by state for the frontend
    const grouped = ambassadors.reduce((acc: any, curr: any) => {
      const state = curr.state;
      if (!acc[state]) {
        acc[state] = { state, ambassadors: [] };
      }
      acc[state].ambassadors.push({
        _id: curr._id,
        name: curr.name,
        image: curr.image
      });
      return acc;
    }, {});

    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ambassadors' }, { status: 500 });
  }
}
