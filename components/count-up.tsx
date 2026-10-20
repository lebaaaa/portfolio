"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Counts the leading number of a value like "849" or "59/60" up from zero
// when it scrolls into view. Writes to the DOM directly, no re-renders. The
// server-rendered text is the real value, so it reads correctly without JS.
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\d+)(.*)$/);
    if (!el || !m || reduce) return;
    if (!inView) {
      el.textContent = `0${m[2]}`;
      return;
    }
    const controls = animate(0, Number(m[1]), {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${m[2]}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <>
      <span ref={ref} aria-hidden>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
