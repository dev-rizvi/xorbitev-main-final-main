import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl
  const isPathAdmin = pathname.startsWith('/admin')

  console.log(`[Proxy] Path: ${pathname}, Session: ${session?.value ? 'Present' : 'Missing'}`)

  if (isPathAdmin && !session) {
    console.log(`[Proxy] Redirecting unauthorized access from ${pathname} to /login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if user is already logged in and tries to access login page
  if (pathname === '/login' && session) {
    console.log(`[Proxy] Redirecting authenticated user from /login to /admin/dashboard`)
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
