"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

// Reveals its content through an arch that rises from the bottom centre and
// widens as it scrolls into view, ending as a normal rounded rectangle.
// Scroll-linked, so it follows the scroll in both directions. Static under
// reduced motion.
export function ArchReveal({
  children,
  className,
  radius = 16,
  start = "start end",
  end = "start 0.45",
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // motion's offset type is a template-literal union; these are valid pairs
    offset: [start, end] as never,
  });
  const clipPath = useTransform(scrollYProgress, (p) => {
    const e = 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3); // ease-out
    const top = (1 - e) * 92;
    const side = (1 - e) * 44;
    const r = radius + (1 - e) * 900;
    return `inset(${top}% ${side}% 0% round ${r}px ${r}px ${radius}px ${radius}px)`;
  });

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { clipPath }}>
      {children}
    </motion.div>
  );
}
