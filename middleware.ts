// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { jwtVerify } from 'jose'

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

// // Routes that don’t require auth
// const PUBLIC_PATHS = [
//   '/',           // allow your root redirect to signup
//   '/login',
//   '/signup',
//   '/emailpage',
//   '/api/auth/login',
//   '/api/auth/signup',
//   '/api/auth/send-otp',
//   '/api/auth/verify-otp',
// ]

// function isPublic(pathname: string) {
//   return PUBLIC_PATHS.some(
//     (p) => pathname === p || pathname.startsWith(p + '/')
//   )
// }

// async function verifyToken(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, JWT_SECRET)
//     return payload
//   } catch {
//     return null
//   }
// }

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl

//   // 1) If this path is public, let it through
//   if (isPublic(pathname)) {
//     return NextResponse.next()
//   }

//   // 2) Otherwise, check for a valid JWT cookie
//   const token = req.cookies.get('token')?.value
//   if (!token) {
//     // If this is an API call, return 401 JSON
//     if (pathname.startsWith('/api/')) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }
//     // Else redirect to login
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

//   // 3) Validate JWT
//   const user = await verifyToken(token)
//   if (!user) {
//     // Clear bad cookie & send to login
//     const res = NextResponse.redirect(new URL('/login', req.url))
//     res.cookies.delete('token')
//     return res
//   }

//   // 4) All good
//   return NextResponse.next()
// }

// // **Only** apply this middleware to the paths we actually want to guard.
// // Remove the generic catch-all—instead we’ll let PUBLIC_PATHS handle the rest.
// export const config = {
//   matcher: ['/buttons/:path*', '/api/user'], 
// }

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

// Routes that don’t require auth
const PUBLIC_PATHS = [
  '/',           // root redirect to signup
  '/login',
  '/signup',
  '/emailpage',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  )
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1) If this path is public, let it through
  if (isPublic(pathname)) {
    return NextResponse.next()
  }

  // 2) Otherwise, check for a valid JWT cookie (access_token)
  const token = req.cookies.get('access_token')?.value
  if (!token) {
    // If this is an API call, return 401 JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Else redirect to login
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3) Validate JWT
  const user = await verifyToken(token)
  if (!user) {
    // Clear bad cookie & redirect to login
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('access_token')
    return res
  }

  // 4) All good, continue
  return NextResponse.next()
}

// Apply this middleware to your protected routes (exact + wildcard)
export const config = {
  matcher: [
    // exact routes
    '/buttons',
    '/home',
    '/postrun',
    '/weeklyanalysis',
    // any nested under them
    '/buttons/:path*',
    '/home/:path*',
    '/postrun/:path*',
    '/weeklyanalysis/:path*',
    // your protected API proxy
    '/api/user',
  ],
}
