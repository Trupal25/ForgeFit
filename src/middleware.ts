import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/signin', '/signup'];
  const isPublicPath = publicPaths.includes(path);
  
  // Check if the path is for public assets (exclude from auth check)
  const isPublicAsset = 
    path.startsWith('/_next') || 
    path.startsWith('/api/auth') || 
    path.includes('.');
  
  if (isPublicAsset) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Redirect unauthenticated users to sign in page if trying to access protected routes
  if (!token && !isPublicPath) {
    const url = new URL('/signin', req.url);
    url.searchParams.set('callbackUrl', encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users to dashboard when accessing auth pages
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on the defined paths
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}; 