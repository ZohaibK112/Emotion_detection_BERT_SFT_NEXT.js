// import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";

// // Initialize Resend with your API key
// const resend = new Resend(process.env.RESEND_API_KEY);

// // Declare global type for the OTP store
// declare global {
//   var otpStore: Record<string, { otp: string; expiresAt: number }>;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     // Generate a new 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
//     // OTP expires in 10 minutes
//     const expiresAt = Date.now() + 10 * 60 * 1000;
    
//     // Store the new OTP
//     global.otpStore[email] = { otp, expiresAt };

//     // Send email using Resend
//     const { data, error } = await resend.emails.send({
//       from: "Verification <onboarding@resend.dev>", // Use your verified domain in production
//       to: [email],
//       subject: "Your New Verification Code",
//       html: `
//         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Email Verification</h2>
//           <p>Your new verification code is:</p>
//           <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p>This code will expire in 10 minutes.</p>
//           <p>If you didn't request this code, please ignore this email.</p>
//         </div>
//       `,
//     });

//     if (error) {
//       console.error("Error sending email:", error);
//       return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, message: "New OTP sent successfully" });
//   } catch (error) {
//     console.error("Error in resend-otp API:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Define OTP Store type
type OTPStore = Record<string, { otp: string; expiresAt: number }>;

// Define a safer alternative to global declaration
interface CustomGlobal {
  otpStore: OTPStore;
}

// Create a type-safe global store
const globalStore: CustomGlobal = 
  (globalThis as unknown as CustomGlobal).otpStore ? 
  (globalThis as unknown as CustomGlobal) : 
  { otpStore: {} };

// Initialize the store if needed
if (!globalStore.otpStore) {
  globalStore.otpStore = {};
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

    // Store OTP for the email using the safe global store
    globalStore.otpStore[email] = { otp, expiresAt };

    // Send email using Resend
    const response = await resend.emails.send({
      from: "Verification <onboarding@resend.dev>", 
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

    if (response.error) {
      console.error("Error sending email:", response.error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in resend-otp API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}