import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';
import * as jose from 'jose';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export const dynamic = 'force-dynamic';

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const generateUniqueSlug = (name: string) => {
  const baseSlug = slugify(name);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randomSuffix}`;
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    await dbConnect();

    if (!mongoose.isValidObjectId(vendorId)) {
      console.error('Invalid vendorId from JWT:', vendorId);
      return NextResponse.json({ error: 'Invalid vendor identity' }, { status: 400 });
    }

    const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
    const items = await ShopItem.find({ vendorId: vendorObjectId }).sort({ createdAt: -1 });
    console.log(`Fetched ${items.length} products for vendor ${vendorId}`);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Fetch vendor products error:', error);
    return NextResponse.json({ error: 'Failed to fetch shop items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    await dbConnect();

    // Check if vendor is approved
    const Vendor = (await import('@/models/Vendor')).default;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor || !vendor.isApproved) {
      return NextResponse.json({ error: 'Your account is pending approval. Please wait for admin to approve your vendor account.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, images, category, stock, variants, slug } = body;

    const item = new ShopItem({
      name,
      description,
      price,
      images,
      category,
      stock,
      variants,
      slug: slug ? slugify(slug) : generateUniqueSlug(name),
      vendorId: new mongoose.Types.ObjectId(vendorId),
      isFeatured: false 
    });

    await item.save();
    console.log('Vendor product created:', { id: item._id, vendorId: item.vendorId });
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A product with this name already exists or the slug is taken. Please try a slightly different name.' }, { status: 400 });
    }
    console.error('Failed to create vendor shop item:', error);
    return NextResponse.json({ error: 'Failed to create shop item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    // Verify ownership
    const existingItem = await ShopItem.findOne({ 
      _id, 
      vendorId: new mongoose.Types.ObjectId(vendorId)
    });
    
    if (!existingItem) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    } else if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    // Explicitly set/ensure vendorId is correct ObjectId
    updateData.vendorId = new mongoose.Types.ObjectId(vendorId);

    const item = await ShopItem.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to update vendor shop item:', error);
    return NextResponse.json({ error: 'Failed to update shop item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('vendor_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    const vendorId = payload.id as string;

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Verify ownership
    const existingItem = await ShopItem.findOne({ 
      _id: id, 
      vendorId: new mongoose.Types.ObjectId(vendorId)
    });

    if (!existingItem) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
    }

    await ShopItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete vendor shop item:', error);
    return NextResponse.json({ error: 'Failed to delete shop item' }, { status: 500 });
  }
}
