// File: app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL!;
if (!BACKEND) throw new Error('Missing BACKEND_URL');

const AUTH_TTL = 8 * 3600; // 8 hours in seconds
const isProd = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest) {
  const body = await request.text();
  try {
    const apiRes = await fetch(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const data = await apiRes.json();

    // forward errors
    if (!apiRes.ok || !data.access_token) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    // on success, set the cookie
    const res = NextResponse.json({ success: true, user: data.user });
    res.cookies.set({
      name: 'access_token',
      value: data.access_token,
      httpOnly: true,
      secure: isProd,                       // secure only in prod
      sameSite: isProd ? 'none' : 'lax',    // none+lax depending on env
      path: '/',
      maxAge: data.expires_in ?? AUTH_TTL,
    });
    return res;
  } catch (err: any) {
    console.error('Login proxy error:', err);
    return NextResponse.json(
      { success: false, message: 'Auth service unreachable' },
      { status: 502 }
    );
  }
}
