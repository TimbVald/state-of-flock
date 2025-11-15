import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const protectedPaths = [
  '/dashboard',
  '/members',
  '/attendance',
  '/follow-up',
  '/reports',
  '/admin',
]

export async function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const isProtected = protectedPaths.some((p) => url.pathname === p || url.pathname.startsWith(`${p}/`))
  if (!isProtected) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', url.pathname)
    return NextResponse.redirect(redirectUrl)
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/|static/|images/|favicon.ico).*)'],
}