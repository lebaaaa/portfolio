import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks, Clip } from "@/components/blocks";
import { getProject, projects } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.short,
    openGraph: { title: project.title, description: project.short },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pt-10 sm:pt-16">
      <Link
        href="/#work"
        className="font-mono text-[13px] text-muted hover:text-fg"
      >
        ← All projects
      </Link>

      <header className="mt-8 max-w-4xl">
        <p className="font-mono text-[13px] text-muted">
          {[project.when, project.role].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-[1.08] tracking-tight sm:text-[3.4rem]">
          {project.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
          {project.intro}
        </p>
        <p className="mt-6 text-sm text-muted">
          <span className="font-mono text-xs">Built with</span>{" "}
          {project.stack.join(" · ")}
        </p>
      </header>

      {(project.media || project.stats) && (
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          {project.media && (
            <div className={project.media.pixelated ? "max-w-sm" : ""}>
              <Clip media={project.media} eager />
            </div>
          )}
          {project.stats && (
            <dl
              className={`divide-y divide-line border-y border-line ${
                project.media ? "" : "lg:col-span-2 lg:max-w-3xl"
              }`}
            >
              {project.stats.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[10.5rem_1fr] items-baseline gap-4 py-4 sm:grid-cols-[11.5rem_1fr]"
                >
                  <dt className="font-mono text-base whitespace-nowrap tabular-nums sm:text-xl">{s.value}</dt>
                  <dd className="text-sm leading-snug text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      <div className="mt-16 space-y-14 sm:mt-20">
        {project.sections.map((section) => (
          <section
            key={section.heading}
            className="grid gap-4 border-t border-line pt-6 lg:grid-cols-[16rem_1fr] lg:gap-14"
          >
            <h2 className="font-serif text-2xl leading-snug tracking-tight">
              {section.heading}
            </h2>
            <div className="max-w-2xl text-[16.5px]">
              <Blocks blocks={section.blocks} />
            </div>
          </section>
        ))}
      </div>

      <nav className="mt-24 border-t border-line pt-6">
        <p className="font-mono text-[13px] text-muted">Next project</p>
        <Link
          href={`/projects/${next.slug}`}
          className="mt-2 inline-block font-serif text-2xl decoration-accent decoration-1 underline-offset-4 hover:underline sm:text-3xl"
        >
          {next.title} →
        </Link>
      </nav>
    </article>
  );
}
