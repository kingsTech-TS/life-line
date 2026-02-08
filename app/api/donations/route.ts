import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import Project from '@/models/Project'; // Ensure Project model is registered

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Fetch recent completed donations
    const donations = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('projectId', 'title');

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Fetch donations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
