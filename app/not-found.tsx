import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-24 sm:pt-32">
      <p className="font-mono text-[13px] text-muted">404</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight">
        This page drove off the track.
      </h1>
      <Link
        href="/"
        className="mt-8 inline-block font-medium underline decoration-line hover:decoration-accent"
      >
        Back to the start line →
      </Link>
    </div>
  );
}
