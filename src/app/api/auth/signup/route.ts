// File: src/app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND = process.env.BACKEND_URL;
if (!BACKEND) {
  throw new Error('Missing BACKEND_URL environment variable');
}

export async function POST(request: NextRequest) {
  // 1) Safely read the incoming JSON body
  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch (err) {
    console.error('Failed to read request body:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }

  // 2) Proxy to the FastAPI signup endpoint
  try {
    const apiRes = await fetch(`${BACKEND}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyText,
    });

    // 3) Mirror the response status and JSON
    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (err: any) {
    console.error('Signup proxy error:', err);
    return NextResponse.json(
      { success: false, message: 'Auth service unreachable.' },
      { status: 502 }
    );
  }
}
