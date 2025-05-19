// File: app/api/auth/send-otp/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import Mailjet from 'node-mailjet';

const {
  JWT_OTP_SECRET,
  MAILJET_API_KEY,
  MAILJET_API_SECRET,
  MAILJET_SENDER_EMAIL,
} = process.env;

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// 1) Validate env at runtime
if (!JWT_OTP_SECRET) {
  console.error('Missing JWT_OTP_SECRET env var');
}
if (!MAILJET_API_KEY || !MAILJET_API_SECRET || !MAILJET_SENDER_EMAIL) {
  console.error('Missing Mailjet configuration in env');
}

// 2) Initialize Mailjet client if possible
let mailjet: ReturnType<typeof Mailjet.apiConnect> | null = null;
if (MAILJET_API_KEY && MAILJET_API_SECRET) {
  mailjet = Mailjet.apiConnect(MAILJET_API_KEY, MAILJET_API_SECRET);
}

export async function POST(req: NextRequest) {
  // 3) Env checks
  if (!JWT_OTP_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Server misconfiguration (OTP secret)' },
      { status: 500 }
    );
  }
  if (!mailjet || !MAILJET_SENDER_EMAIL) {
    return NextResponse.json(
      { success: false, error: 'Server misconfiguration (Mailjet)' },
      { status: 500 }
    );
  }

  // 4) Parse and validate request body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const email = (body.email || '').trim();
  if (!email) {
    return NextResponse.json(
      { success: false, error: 'Email is required' },
      { status: 400 }
    );
  }

  // 5) Generate OTP and sign it into a short‐lived JWT
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + OTP_TTL_MS;

  let token: string;
  try {
    token = jwt.sign(
      { email, otp, expiresAt },
      JWT_OTP_SECRET,
      { algorithm: 'HS256', expiresIn: '10m' }
    );
  } catch (err) {
    console.error('Error signing OTP JWT:', err);
    return NextResponse.json(
      { success: false, error: 'Server error generating OTP' },
      { status: 500 }
    );
  }

  // 6) Send OTP email via Mailjet
  try {
    await mailjet!
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: { Email: MAILJET_SENDER_EMAIL, Name: 'Your App Name' },
            To:   [{ Email: email }],
            Subject: 'Your Verification Code',
            TextPart: `Your OTP is ${otp}. It expires in 10 minutes.`,
            HTMLPart: `
              <div style="font-family:Arial,sans-serif;padding:20px;">
                <h2>Email Verification</h2>
                <p>Your one-time code is:</p>
                <div style="font-size: 24px; font-weight: bold; margin:10px 0;">
                  ${otp}
                </div>
                <p style="color:#666;">This code will expire in 10 minutes.</p>
              </div>
            `,
          },
        ],
      });

    // 7) Return the OTP‐JWT in JSON (no cookie here)
    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (mailErr: any) {
    console.error('Mailjet send error:', mailErr);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP email' },
      { status: 502 }
    );
  }
}
