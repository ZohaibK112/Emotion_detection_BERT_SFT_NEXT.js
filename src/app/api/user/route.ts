// File: app/api/user/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL!;
if (!BACKEND) throw new Error('Missing BACKEND_URL');

function extractJwtFromCookie(cookie: string): string | null {
  const match = cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const jwtToken     = extractJwtFromCookie(cookieHeader);

  if (!jwtToken) {
    return NextResponse.json({ error: 'Unauthorized – no token' }, { status: 401 });
  }

  const apiRes = await fetch(`${BACKEND}https://zohaibk112-the-runners-bert-emotions.hf.space/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type':  'application/json',
      'Cookie':        cookieHeader,
      'Authorization': `Bearer ${jwtToken}`,
    },
  });

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
