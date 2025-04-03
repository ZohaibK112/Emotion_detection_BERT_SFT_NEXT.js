import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Define OTP Store type
type OTPStore = Record<string, { otp: string; expiresAt: number }>;

// Ensure globalThis.otpStore is properly initialized
if (!("otpStore" in globalThis)) {
  (globalThis as any).otpStore = {} as OTPStore;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // OTP expires in 10 minutes
    const expiresAt = Date.now() + 10 * 60 * 1000;
    
    // Store OTP for the email
    (globalThis as any).otpStore[email] = { otp, expiresAt };

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: "Verification <onboarding@resend.dev>", // Use your verified domain in production
      to: [email],
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in send-otp API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
