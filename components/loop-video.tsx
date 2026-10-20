"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

// A muted looping clip with a pause control. It only plays while on screen,
// and stays on its poster frame for visitors who prefer reduced motion.
export function LoopVideo({
  src,
  poster,
  width,
  height,
  label,
  pixelated,
  fit = "contain",
  className = "",
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  pixelated?: boolean;
  fit?: "contain" | "cover";
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.current = true;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          v.play().then(() => setPaused(false)).catch(() => setPaused(true));
        } else {
          v.pause();
          setPaused(true);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().then(() => setPaused(false)).catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        className={`block h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        style={pixelated ? { imageRendering: "pixelated" } : undefined}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play clip" : "Pause clip"}
        className="absolute right-2.5 bottom-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#16213e]/75 text-white backdrop-blur-sm transition-[background-color,transform] hover:bg-[#16213e] active:scale-95"
      >
        {paused ? (
          <Play size={14} weight="fill" aria-hidden />
        ) : (
          <Pause size={14} weight="fill" aria-hidden />
        )}
      </button>
    </div>
  );
}
