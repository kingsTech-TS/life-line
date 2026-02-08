import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const posts = await Blog.find({ status: 'published' })
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
