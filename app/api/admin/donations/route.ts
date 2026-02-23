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

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    const donation = await Donation.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(donation);
  } catch (error) {
    console.error('Update donation error:', error);
    return NextResponse.json({ error: 'Failed to update donation' }, { status: 500 });
  }
}
