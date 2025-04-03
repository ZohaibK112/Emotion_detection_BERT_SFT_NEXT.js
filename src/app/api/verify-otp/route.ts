import { NextRequest, NextResponse } from "next/server";

// Declare a temporary in-memory store (use Redis or DB in production)
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate the incoming request
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry time

    // Store OTP in the store
    otpStore[email] = { otp, expiresAt };

    // Log OTP Store for debugging
    console.log("OTP stored:", otpStore);

    // Send OTP to email (simulated for now)
    // Replace this with your actual email-sending logic
    console.log(`Sending OTP ${otp} to ${email}`);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
