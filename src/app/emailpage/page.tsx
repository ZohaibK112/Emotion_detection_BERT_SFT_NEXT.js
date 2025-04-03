"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailOTP() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

  const fetchApi = async (url: string, payload: object) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (err) {
      console.error("API request failed:", err); // Log the error
      return { success: false, data: { error: "Something went wrong!" } };
    }
  };

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setMessage({ text: "Please enter a valid email.", type: "error" });
      return;
    }

    const { success, data } = await fetchApi("/api/send-otp", { email });

    if (success) {
      setOtpSent(true);
      setMessage({ text: "OTP sent successfully!", type: "success" });
    } else {
      setMessage({ text: data.error || "Failed to send OTP", type: "error" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage({ text: "Please enter the OTP.", type: "error" });
      return;
    }

    const { success, data } = await fetchApi("/api/verify-otp", { email, otp });

    if (success) {
      setMessage({ text: "OTP verified! Redirecting...", type: "success" });

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);

      setTimeout(() => {
        router.push("/Buttons");  // Use the correct path to the button selection page
      }, 2000);
    } else {
      setMessage({ text: data.error || "Invalid OTP", type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Email Verification</h2>

        <label className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md mb-3"
          disabled={otpSent}
        />

        {!otpSent && (
          <button onClick={handleSendOtp} className="w-full py-2 bg-blue-600 text-white rounded-md">
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded-md mb-3"
            />

            <button onClick={handleVerifyOtp} className="w-full py-2 bg-green-600 text-white rounded-md">
              Verify OTP
            </button>
          </>
        )}

        {message.text && (
          <p className={`mt-4 text-center text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
