import { NextResponse } from 'next/server';
import { dashboardRedirect } from './lib/dashboard-standalone.mjs';

export function middleware(request) {
  const destination = dashboardRedirect(request.nextUrl.pathname);
  if (!destination) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = destination;
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
