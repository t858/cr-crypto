import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Ensure this matches your NextAuth secret in lib/authOptions.ts
const secret = process.env.NEXTAUTH_SECRET || "fallback_secret_for_development_only_12345";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Fetch the active NextAuth token
  const token = await getToken({ req, secret });

  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  // We only want to protect routes starting with /dashboard
  if (pathname.startsWith('/dashboard')) {
    // If no token exists, the user is not authenticated. Redirect to /signin.
    if (!token) {
      console.log("Unauthorized access attempt to:", pathname);
      const signInUrl = new URL('/signin', req.url);
      // Optionally append a callbackUrl to return them to the dashboard after signing in
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow normal requests through
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
