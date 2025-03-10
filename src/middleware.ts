import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /admin/dashboard)
  const path = request.nextUrl.pathname;

  // If it's an admin route but not the login page
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check if the user is authenticated by looking for the admin token
    const adminToken = request.cookies.get('adminToken')?.value;

    // If there's no token, redirect to the login page
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 