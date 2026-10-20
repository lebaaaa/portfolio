import { PillLink } from "@/components/pill-link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-20 sm:px-8 sm:pt-28">
      <p className="font-mono text-sm font-medium text-accent-ink">404</p>
      <h1 className="mt-3 font-display text-5xl leading-none font-bold tracking-tight sm:text-6xl">
        This page drove off the track.
      </h1>
      <PillLink href="/" tone="dark" className="mt-10">
        Back to the start line
      </PillLink>
    </div>
  );
}
