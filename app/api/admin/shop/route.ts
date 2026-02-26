import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const items = await ShopItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shop items' }, { status: 500 });
  }
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.slug && body.name) {
      body.slug = slugify(body.name);
    } else if (body.slug) {
      body.slug = slugify(body.slug);
    }
    const item = new ShopItem(body);
    await item.save();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create shop item:', error);
    return NextResponse.json({ error: 'Failed to create shop item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    } else if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }
    const item = await ShopItem.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to update shop item:', error);
    return NextResponse.json({ error: 'Failed to update shop item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await ShopItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shop item' }, { status: 500 });
  }
}
