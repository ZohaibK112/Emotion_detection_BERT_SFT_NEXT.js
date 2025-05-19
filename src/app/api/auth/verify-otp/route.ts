// File: app/api/auth/verify-otp/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL!;
if (!BACKEND) throw new Error('Missing BACKEND_URL');

export async function POST(request: NextRequest) {
  // 1) Forward the incoming body to FastAPI
  const bodyText = await request.text();
  const res = await fetch(
    `/api/auth/verify-otp`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyText,
    }
  );

  // 2) Mirror status & JSON
  const data = await res.json();
  const nextRes = NextResponse.json(data, { status: res.status });

  // 3) Copy through any Set-Cookie headers from FastAPI
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    // If multiple cookies, split and append each
    setCookie.split(',').forEach(cookieStr => {
      nextRes.headers.append('Set-Cookie', cookieStr);
    });
  }

  return nextRes;
}
