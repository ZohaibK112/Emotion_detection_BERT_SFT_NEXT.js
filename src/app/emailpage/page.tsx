// 'use client';

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function EmailOTP() {
//   const router = useRouter();
//   const [email, setEmail]             = useState("");
//   const [otp, setOtp]                 = useState("");
//   const [otpSent, setOtpSent]         = useState(false);
//   const [loading, setLoading]         = useState(false);
//   const [message, setMessage]         = useState<{ text: string; type: "success" | "error" | "" }>({
//     text: "",
//     type: "",
//   });

//   const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

//   async function sendOtp() {
//     if (!isValidEmail(email)) {
//       setMessage({ text: "Please enter a valid email.", type: "error" });
//       return;
//     }
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       const res = await fetch("https://zohaibk112-the-runners-bert-emotions.hf.space/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setOtpSent(true);
//         setMessage({ text: "OTP sent successfully! Check your email.", type: "success" });
//         localStorage.setItem("otpToken", data.token);
//       } else {
//         setMessage({ text: data.error || "Failed to send OTP.", type: "error" });
//       }
//     } catch (err) {
//       console.error("Send OTP error:", err);
//       setMessage({ text: "Network error. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function verifyOtp() {
//     if (!otp.trim()) {
//       setMessage({ text: "Please enter the OTP.", type: "error" });
//       return;
//     }
//     const token = localStorage.getItem("otpToken");
//     if (!token) {
//       setMessage({ text: "OTP session expired. Please request a new one.", type: "error" });
//       setOtpSent(false);
//       return;
//     }

//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       const res = await fetch("https://zohaibk112-the-runners-bert-emotions.hf.space/api/auth/verify-otp", {
//         method: "POST",
//         credentials: "include",  // accept Set-Cookie
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp, token }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         localStorage.removeItem("otpToken");
//         setMessage({ text: "OTP verified! Redirecting…", type: "success" });
//         setTimeout(() => router.replace("/buttons"), 1000);
//       } else {
//         setMessage({ text: data.error || "Invalid OTP.", type: "error" });
//       }
//     } catch (err) {
//       console.error("Verify OTP error:", err);
//       setMessage({ text: "Network error. Please try again.", type: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4 text-center">Email Verification</h2>

//         <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//         <input
//           type="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           disabled={otpSent || loading}
//           className="w-full p-2 border rounded-md mb-4"
//         />

//         {!otpSent ? (
//           <button
//             onClick={sendOtp}
//             disabled={loading}
//             className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             {loading ? "Sending…" : "Send OTP"}
//           </button>
//         ) : (
//           <>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
//             <input
//               type="text"
//               value={otp}
//               onChange={e => setOtp(e.target.value)}
//               disabled={loading}
//               className="w-full p-2 border rounded-md mb-4"
//             />
//             <button
//               onClick={verifyOtp}
//               disabled={loading}
//               className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition mb-2"
//             >
//               {loading ? "Verifying…" : "Verify OTP"}
//             </button>
//             <button
//               onClick={sendOtp}
//               disabled={loading}
//               className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
//             >
//               {loading ? "Resending…" : "Resend OTP"}
//             </button>
//           </>
//         )}

//         {message.text && (
//           <p className={`mt-4 text-center text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
//             {message.text}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailOTP() {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [otpSent, setOtpSent]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [message, setMessage]       = useState<{ text: string; type: "success" | "error" | "" }>({
    text: "",
    type: "",
  });

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  async function sendOtp() {
    if (!isValidEmail(email)) {
      setMessage({ text: "Please enter a valid email.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setMessage({ text: "OTP sent successfully! Check your email.", type: "success" });
        localStorage.setItem("otpToken", data.token);
      } else {
        setMessage({ text: data.error || "Failed to send OTP.", type: "error" });
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp.trim()) {
      setMessage({ text: "Please enter the OTP.", type: "error" });
      return;
    }
    const token = localStorage.getItem("otpToken");
    if (!token) {
      setMessage({ text: "OTP session expired. Please request a new one.", type: "error" });
      setOtpSent(false);
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",  // accept Set-Cookie from proxy
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, token }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.removeItem("otpToken");
        setMessage({ text: "OTP verified! Redirecting…", type: "success" });
        setTimeout(() => router.replace("/buttons"), 1000);
      } else {
        setMessage({ text: data.error || "Invalid OTP.", type: "error" });
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Email Verification</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={otpSent || loading}
          className="w-full p-2 border rounded-md mb-4"
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              disabled={loading}
              className="w-full p-2 border rounded-md mb-4"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition mb-2"
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              {loading ? "Resending…" : "Resend OTP"}
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

