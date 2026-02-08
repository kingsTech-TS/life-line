import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImpactReport from '@/models/ImpactReport';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const reports = await ImpactReport.find({})
      .sort({ year: -1, createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Fetch impact reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
