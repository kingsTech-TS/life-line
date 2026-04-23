import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      console.log('Middleware: No token found in cookies');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      console.log('Middleware: Token verified for user:', payload.username);
      return NextResponse.next();
    } catch (e) {
      console.error('Middleware: Token verification failed:', e);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect vendor routes
  if (pathname.startsWith('/vendor') && !pathname.startsWith('/vendor/login') && !pathname.startsWith('/vendor/signup')) {
    const token = request.cookies.get('vendor_token')?.value;

    if (!token) {
      console.log('Middleware: No vendor token found in cookies');
      return NextResponse.redirect(new URL('/vendor/login', request.url));
    }

    try {
      const { payload } = await jose.jwtVerify(token, secret);
      console.log('Middleware: Vendor token verified for:', payload.businessName);
      return NextResponse.next();
    } catch (e) {
      console.error('Middleware: Vendor token verification failed:', e);
      return NextResponse.redirect(new URL('/vendor/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*'],
};
