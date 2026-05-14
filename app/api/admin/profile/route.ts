import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');

async function getAdminFromToken(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminPayload = await getAdminFromToken(req);
    if (!adminPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, email, phone } = await req.json();
    await dbConnect();

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;

    const admin = await Admin.findByIdAndUpdate(adminPayload.id, updateData, { new: true });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    console.error('Failed to update admin profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
