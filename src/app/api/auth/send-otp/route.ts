// File: app/api/auth/send-otp/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL!;
if (!BACKEND) throw new Error('Missing BACKEND_URL');

export async function POST(req: NextRequest) {
  // 1) Grab the raw body
  const bodyText = await req.text();

  // 2) Forward to your FastAPI Space
  const res = await fetch(`${BACKEND}/api/auth/send-otp`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    bodyText,
  });

  // 3) Mirror status & JSON
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
