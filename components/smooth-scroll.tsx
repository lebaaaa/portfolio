"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

// Weighted, eased scrolling on top of the browser's native scroll, so anchors,
// keyboard scrolling and scroll-linked animations keep working. Off for
// visitors who prefer reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -88 }, autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
