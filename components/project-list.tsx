import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectList({
  projects,
  start = 1,
}: {
  projects: Project[];
  start?: number;
}) {
  return (
    <ol className="border-t border-line">
      {projects.map((p, i) => (
        <li key={p.slug} className="border-b border-line">
          <Link
            href={`/projects/${p.slug}`}
            className="group grid grid-cols-[2.25rem_1fr] gap-x-3 py-6 sm:grid-cols-[3rem_1fr_9rem] sm:gap-x-6"
          >
            <span className="pt-1 font-mono text-xs text-muted tabular-nums">
              {String(start + i).padStart(2, "0")}
            </span>
            <span>
              <span className="font-serif text-xl leading-snug decoration-accent decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
                {p.title}
              </span>
              <span className="mt-1.5 block max-w-2xl text-[15px] leading-relaxed text-muted">
                {p.short}
              </span>
            </span>
            <span className="col-start-2 mt-2 font-mono text-xs text-muted sm:col-start-3 sm:mt-1.5 sm:text-right">
              {p.when ?? p.role}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
