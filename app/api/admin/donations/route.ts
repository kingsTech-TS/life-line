import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Donation from '@/models/Donation';
import Project from '@/models/Project'; // Import to register the model for populate

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // In a real app, you'd add middleware to check for admin session
    // For now, we'll just fetch
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .populate('projectId', 'title');

    return NextResponse.json(donations);
  } catch (error) {
    console.error('Fetch donations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
