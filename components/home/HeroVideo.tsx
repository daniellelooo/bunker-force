"use client";

import { useRef, useEffect } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const FADE = 1.5;
    let fadingOut = false;

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const left = video.duration - video.currentTime;
      if (left <= FADE && !fadingOut) {
        fadingOut = true;
        video.style.opacity = "0";
      }
      if (video.currentTime < FADE && fadingOut) {
        fadingOut = false;
        video.style.opacity = "1";
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
      style={{ filter: "grayscale(0.4) brightness(0.5)", transition: "opacity 1.5s ease" }}
    >
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
