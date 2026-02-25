import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const VISITOR_COOKIE = 'fac_visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export function middleware(request: NextRequest) {
    const res = NextResponse.next()
    if (!request.cookies.get(VISITOR_COOKIE)) {
        res.cookies.set(VISITOR_COOKIE, crypto.randomUUID(), {
            path: '/',
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'lax',
        })
    }
    return res
}
