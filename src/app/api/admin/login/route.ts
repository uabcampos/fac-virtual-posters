import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const ADMIN_COOKIE = 'fac_admin'
const ONE_DAY = 60 * 60 * 24

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const secret = formData.get('secret')

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirect') || '/admin'

  if (typeof secret !== 'string' || secret !== env.ADMIN_SECRET) {
    const res = NextResponse.redirect(new URL(`/admin?error=1`, request.url))
    res.cookies.delete(ADMIN_COOKIE)
    return res
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url))
  response.cookies.set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: ONE_DAY * 7,
  })

  return response
}

