import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-8 sm:pt-28">
      <p className="font-mono text-sm font-medium text-accent-ink">404</p>
      <h1 className="mt-3 font-display text-5xl leading-none font-bold tracking-tight sm:text-6xl">
        This page drove off the track.
      </h1>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-on-color transition-transform hover:-translate-y-0.5"
      >
        Back to the start line
        <ArrowRight size={16} weight="bold" aria-hidden />
      </Link>
    </div>
  );
}
