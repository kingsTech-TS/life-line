import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ImpactReport from '@/models/ImpactReport';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const reports = await ImpactReport.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch impact reports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const report = new ImpactReport(body);
    await report.save();
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create impact report' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    const report = await ImpactReport.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update impact report' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await ImpactReport.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete impact report' }, { status: 500 });
  }
}
