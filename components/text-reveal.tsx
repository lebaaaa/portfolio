"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

type Segment = { text: string; mark?: boolean };

// Headline words slide up out of their own line mask, one after another.
// A segment marked `mark` gets the gold highlighter, which sweeps in after
// the words land. Plain text under reduced motion.
export function TextReveal({
  segments,
  onView = false,
  delay = 0,
}: {
  segments: Segment[];
  onView?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <>
        {segments.map((s, i) => (
          <Fragment key={i}>
            <span className={s.mark ? "mark" : undefined}>{s.text}</span>
            {i < segments.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </>
    );
  }

  let index = 0;
  const total = segments.reduce((n, s) => n + s.text.split(" ").filter(Boolean).length, 0);
  const trigger = onView
    ? { whileInView: "in" as const, viewport: { once: true, amount: 0.6 } }
    : { animate: "in" as const };

  return (
    <motion.span initial="out" {...trigger}>
      {segments.map((s, si) => {
        const words = s.text.split(" ").filter(Boolean);
        const inner = words.map((w, k) => {
          const i = index++;
          return (
            <Fragment key={k}>
              <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{ out: { y: "110%" }, in: { y: "0%" } }}
                  transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {w}
                </motion.span>
              </span>
              {k < words.length - 1 ? " " : ""}
            </Fragment>
          );
        });
        const gap = si < segments.length - 1 ? " " : "";
        if (!s.mark) {
          return (
            <Fragment key={si}>
              {inner}
              {gap}
            </Fragment>
          );
        }
        return (
          <Fragment key={si}>
            <motion.span
              className="mark"
              style={{ backgroundRepeat: "no-repeat" }}
              variants={{ out: { backgroundSize: "0% 100%" }, in: { backgroundSize: "100% 100%" } }}
              transition={{ duration: 0.8, delay: delay + total * 0.06 + 0.35, ease: [0.65, 0, 0.35, 1] }}
            >
              {inner}
            </motion.span>
            {gap}
          </Fragment>
        );
      })}
    </motion.span>
  );
}
