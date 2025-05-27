// File: src/app/api/predict/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL!;
if (!BACKEND) throw new Error('Missing BACKEND_URL');

export async function POST(request: NextRequest) {
  // forward incoming JSON + cookies to your FastAPI predict endpoint
  const body = await request.text();
  const res  = await fetch(
    `${BACKEND}/predict`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // forward the cookie so JWT is passed
        'Cookie': request.headers.get('cookie') || '',
      },
      body,
    }
  );

  // mirror status & JSON
  const data = await res.json();
  const nextRes = NextResponse.json(data, { status: res.status });

  // no Set-Cookie expected here, so we’re done
  return nextRes;
}
