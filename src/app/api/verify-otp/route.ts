import { NextRequest, NextResponse } from "next/server";

// Declare global type for the OTP store
declare global {
  var otpStore: Record<string, { otp: string; expiresAt: number }>;
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const storedData = global.otpStore[email];

    if (!storedData) {
      return NextResponse.json(
        { error: "No OTP found for this email" },
        { status: 400 }
      );
    }

    if (Date.now() > storedData.expiresAt) {
      // Clean up expired OTP
      delete global.otpStore[email];
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP is valid - clean up after successful verification
    delete global.otpStore[email];

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in verify-otp API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}