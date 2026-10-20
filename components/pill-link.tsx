import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

type Tone = "light" | "dark" | "gold";
type Dir = "right" | "down" | "out";

const tones: Record<Tone, string> = {
  light: "bg-panel text-fg ring-1 ring-line ring-inset group-hover:bg-fg group-hover:text-bg group-hover:ring-fg",
  dark: "bg-fg text-bg group-hover:bg-accent group-hover:text-on-color",
  gold: "bg-gold text-on-color group-hover:bg-band-fg",
};

const icons = { right: ArrowRight, down: ArrowDown, out: ArrowUpRight };

// The arrow leaves its circle in the direction it points, and a fresh one
// slides in behind it.
const exit: Record<Dir, string> = {
  right: "group-hover:translate-x-[180%]",
  down: "group-hover:translate-y-[180%]",
  out: "group-hover:translate-x-[180%] group-hover:-translate-y-[180%]",
};
const enter: Record<Dir, string> = {
  right: "-translate-x-[180%] group-hover:translate-x-0",
  down: "-translate-y-[180%] group-hover:translate-y-0",
  out: "-translate-x-[180%] translate-y-[180%] group-hover:translate-x-0 group-hover:translate-y-0",
};

// A label pill with a separate coral circle for the arrow.
export function PillLink({
  href,
  children,
  tone = "light",
  dir = "right",
  external,
  circle = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  dir?: Dir;
  external?: boolean;
  circle?: boolean;
  className?: string;
}) {
  const Icon = icons[dir];
  const inner = (
    <>
      <span
        className={`inline-flex min-w-0 items-center rounded-full px-5 py-2.5 font-medium transition-colors duration-300 ${tones[tone]}`}
      >
        <span className="truncate">{children}</span>
      </span>
      {circle && (
        <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-accent text-on-color transition-transform duration-300 group-hover:scale-105">
          <Icon
            size={17}
            weight="bold"
            aria-hidden
            className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${exit[dir]}`}
          />
          <Icon
            size={17}
            weight="bold"
            aria-hidden
            className={`absolute transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${enter[dir]}`}
          />
        </span>
      )}
    </>
  );
  const cls = `group inline-flex max-w-full items-center gap-1 active:scale-[0.98] transition-transform ${className}`;
  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
