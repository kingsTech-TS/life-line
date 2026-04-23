import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jose.jwtVerify(token, secret);
    
    return NextResponse.json({ 
      admin: {
        username: payload.username || 'Admin'
      } 
    });
  } catch (error) {
    console.error('Fetch admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
