// // "use client";

// // import { useState, useEffect, useRef } from "react";
// // import { useRouter } from "next/navigation"; // Import useRouter
// // import "../app/style.css";
// // import {
// //   BarChart,
// //   Bar,
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts"; // Import Recharts

// // export default function Home() {
// //   const videoRef = useRef<HTMLVideoElement | null>(null);
// //   const router = useRouter(); // Initialize router

// //   const questions = [
// //     "How are you feeling before the run?",
// //     "What is your energy level right now?",
// //     "Are you motivated to complete your run?",
// //     "How well did you sleep last night?",
// //     "Do you feel any muscle soreness before running?",
// //   ];

// //   const [responses, setResponses] = useState<
// //     { text: string; emotion?: string; score?: number }[] 
// //   >(questions.map(() => ({ text: "" })));

// //   const [isClient, setIsClient] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const userId = "12345"; // Replace with actual user ID from authentication

// //   useEffect(() => {
// //     setIsClient(true);
// //     if (videoRef.current) {
// //       videoRef.current.play();
// //     }
// //   }, []);

// //   const handleSubmit = async () => {
// //     setLoading(true);
// //     try {
// //       const updatedResponses = [...responses];

// //       for (let i = 0; i < responses.length; i++) {
// //         if (responses[i].text.trim() === "") continue;

// //         const response = await fetch("http://127.0.0.1:8000/predict/", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             text: responses[i].text,
// //             user_id: userId, // Sending user ID
// //           }),
// //         });

// //         if (!response.ok) {
// //           throw new Error("Failed to analyze response");
// //         }

// //         const data = await response.json();

// //         updatedResponses[i] = {
// //           text: responses[i].text,
// //           emotion: data.predicted_emotion,
// //           score: data.score,
// //         };
// //       }

// //       setResponses(updatedResponses);
// //     } catch (error) {
// //       console.error("Error:", error);
// //       alert("Failed to get results from backend");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
// //       {/* Video Section (plays first, then redirects to email page) */}
// //       <div className="w-full h-screen flex items-center justify-center bg-black">
// //         <video
// //           ref={videoRef}
// //           className="video-logo"
// //           autoPlay
// //           muted
// //           onEnded={() => setTimeout(() => router.push("/emailpage"), 500)} // Redirect to email page
// //         >
// //           <source src="/logo.mp4" type="video/mp4" />
// //           Your browser does not support the video tag.
// //         </video>
// //       </div>
// //     </div>
// //   );
// // }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoIntro from "../components/VideoIntro";

export default function RootPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    if (isAuthenticated === "true") {
      // If already authenticated, skip intro and go directly to home
      router.push("/Buttons");
      setShouldShowVideo(false);
    }
  }, [router]);

  // Don't render anything until after client-side hydration
  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center bg-black">Loading...</div>;
  }

  return shouldShowVideo ? <VideoIntro /> : null;
}