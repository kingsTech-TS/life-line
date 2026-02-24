import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start of text
    .replace(/-+$/, '');       // Trim - from end of text
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Auto-generate slug if not provided or if we want to force it from title
    if (!body.slug || body.slug.trim() === '') {
      body.slug = slugify(body.title);
    }
    
    const blog = new Blog(body);
    await blog.save();
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    // Update slug if title changed and slug is not manually set/modified significantly
    // Or just always keep them in sync if that's the preferred behavior
    if (updateData.title) {
      updateData.slug = slugify(updateData.title);
    }
    
    const blog = await Blog.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
