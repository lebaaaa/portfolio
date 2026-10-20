"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { href: "/#work", label: "Projects", id: "work" },
  { href: "/about", label: "About", id: "about" },
  { href: "#contact", label: "Contact", id: "contact" },
];

// Top navigation. A coral dot marks where you are: the page you're on, or on
// the home page, the section currently in view.
export function SiteNav() {
  const path = usePathname();
  const [inView, setInView] = useState<string | null>(null);

  useEffect(() => {
    const targets = ["work", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        setInView(seen.get("contact") ? "contact" : seen.get("work") ? "work" : null);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [path]);

  const active =
    inView ?? (path === "/about" ? "about" : path.startsWith("/projects") ? "work" : null);

  return (
    <nav aria-label="Main" className="flex text-sm font-medium sm:gap-2">
      {items.map((n) => {
        const on = active === n.id;
        return (
          <Link
            key={n.id}
            href={n.href}
            aria-current={on ? "true" : undefined}
            className={`relative rounded-full py-1.5 pr-2 pl-3 transition-colors sm:pr-3 sm:pl-4 ${
              on ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            <span
              aria-hidden
              className={`absolute top-1/2 left-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent transition-[transform,opacity] duration-300 sm:left-1.5 ${
                on ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            />
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
