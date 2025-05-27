"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
        setTimeout(() => router.push("/signup"), 500); // Navigate to button.tsx page
      });
    }
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      {videoError ? (
        <div className="text-white">Loading...</div>
      ) : (
        <video
          ref={videoRef}
          className="video-logo max-w-full max-h-full"
          autoPlay
          muted
          onEnded={() => setTimeout(() => router.push("/signup"), 500)} // Navigate after video ends
          onError={() => setVideoError(true)}
        >
          <source src="/logo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
