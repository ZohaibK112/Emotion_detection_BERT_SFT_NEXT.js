"use client";

import { useEffect, useRef } from "react";

export default function AnimatedLogo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="w-32 h-32 mb-4">
      <video ref={videoRef} autoPlay loop muted className="w-full h-full">
        <source src="/logo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
