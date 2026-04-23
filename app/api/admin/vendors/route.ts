import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import ShopItem from '@/models/ShopItem';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get all vendors with their product counts
    const vendors = await Vendor.find({}).sort({ createdAt: -1 }).lean();
    
    // For each vendor, get the count of their products
    const vendorsWithCounts = await Promise.all(
      vendors.map(async (vendor: any) => {
        const vendorIdStr = vendor._id.toString();
        const productCount = await ShopItem.countDocuments({ 
          $or: [
            { vendorId: vendorIdStr },
            { vendorId: mongoose.isValidObjectId(vendorIdStr) ? new mongoose.Types.ObjectId(vendorIdStr) : null }
          ].filter(q => q.vendorId !== null)
        });
        return {
          _id: vendor._id,
          businessName: vendor.businessName,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          commissionRate: vendor.commissionRate,
          isApproved: vendor.isApproved,
          productCount,
          createdAt: vendor.createdAt,
        };
      })
    );
    
    return NextResponse.json(vendorsWithCounts);
  } catch (error) {
    console.error('Failed to fetch vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    const vendor = await Vendor.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Failed to update vendor:', error);
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }
    
    // Optionally delete all products by this vendor
    await ShopItem.deleteMany({ vendorId: id });
    
    await Vendor.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete vendor:', error);
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
