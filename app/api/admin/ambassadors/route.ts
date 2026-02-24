import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Ambassador from '@/models/Ambassador';

// Hardcoded data for migration
const initialAmbassadors = [
    { state: "KWARA STATE", name: "Salisu Rahmat", image: "placeholder.svg" },
    { state: "KWARA STATE", name: "Abdulwaheed Fatimah", image: "placeholder.svg" },
    { state: "ONDO STATE", name: "Onibudo Faith", image: "placeholder.svg" },
    { state: "ONDO STATE", name: "Adamolekun Emmanuel", image: "placeholder.svg" },
    { state: "OYO STATE", name: "Olorunfemi Moyinoluwa", image: "placeholder.svg" },
    { state: "OYO STATE", name: "Warith Ademola", image: "placeholder.svg" },
    { state: "RIVERS STATE", name: "Maxwell PraiseGod", image: "placeholder.svg" },
    { state: "RIVERS STATE", name: "Amaefule Ugochukwu", image: "placeholder.svg" },
    { state: "YOBE STATE", name: "Abubakar Ibrahim", image: "placeholder.svg" },
    { state: "YOBE STATE", name: "Abubakar Adamu", image: "placeholder.svg" },
];

export async function GET() {
  try {
    await dbConnect();
    let ambassadors = await Ambassador.find({}).sort({ state: 1, name: 1 });
    
    // Auto-migration: if empty, seed with initial data
    if (ambassadors.length === 0) {
      ambassadors = await Ambassador.insertMany(initialAmbassadors);
    }
    
    return NextResponse.json(ambassadors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ambassadors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const ambassador = await Ambassador.create(body);
    return NextResponse.json(ambassador);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ambassador' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { _id, ...updateData } = await req.json();
    const ambassador = await Ambassador.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(ambassador);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ambassador' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Ambassador.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Ambassador deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ambassador' }, { status: 500 });
  }
}
