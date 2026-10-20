import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks, Clip } from "@/components/blocks";
import { KeepHyphens } from "@/components/keep-hyphens";
import { PhoneShowcase } from "@/components/phone-showcase";
import { PillLink } from "@/components/pill-link";
import { getProject, projects } from "@/lib/projects";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

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
    <article className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8 sm:pt-10">
      <Link
        href="/#work"
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors -ml-3 hover:bg-panel hover:text-fg"
      >
        <ArrowLeft size={14} weight="bold" aria-hidden />
        All projects
      </Link>

      <header className="mt-8 max-w-4xl">
        <p className="font-mono text-sm font-medium text-accent-ink">
          {[project.when, project.role].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-bold tracking-[-0.03em]">
          <KeepHyphens text={project.title} />
        </h1>
        <p className="mt-6 text-lg leading-relaxed sm:text-xl sm:leading-relaxed">
          {project.intro}
        </p>
        <ul aria-label="Built with" className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((tool) => (
            <li
              key={tool}
              translate="no"
              className="rounded-full bg-panel px-3 py-1 text-sm text-muted ring-1 ring-line ring-inset"
            >
              {tool}
            </li>
          ))}
        </ul>
        {project.links && (
          <p className="mt-6 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <PillLink key={l.href} href={l.href} tone="dark" dir="out" external>
                {l.label}
              </PillLink>
            ))}
          </p>
        )}
      </header>

      {project.showcase && (
        <PhoneShowcase shots={project.showcase} caption={project.showcaseCaption} />
      )}

      {(project.media || project.stats) && (
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          {project.media && (
            <div className={project.media.pixelated ? "max-w-sm" : ""}>
              <Clip media={project.media} eager />
            </div>
          )}
          {project.stats && (
            <dl
              className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-1 ${
                project.media ? "" : "lg:col-span-2 lg:grid-cols-3"
              }`}
            >
              {project.stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-panel p-5 ring-1 ring-line ring-inset">
                  <dt className="font-display text-3xl leading-none font-bold tracking-tight whitespace-nowrap text-accent-ink tabular-nums">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      <div className="mt-16 space-y-14 sm:mt-24 sm:space-y-20">
        {project.sections.map((section) => (
          <section
            key={section.heading}
            className="grid gap-5 lg:grid-cols-[17rem_1fr] lg:gap-14"
          >
            <h2 className="font-display text-2xl leading-tight font-bold tracking-tight lg:sticky lg:top-6 lg:self-start">
              {section.heading}
            </h2>
            <div className="max-w-2xl text-[16.5px]">
              <Blocks blocks={section.blocks} />
            </div>
          </section>
        ))}
      </div>

      <Link
        href={`/projects/${next.slug}`}
        className="group mt-24 flex items-center justify-between gap-6 rounded-2xl bg-accent px-6 py-8 text-on-color transition-transform hover:-translate-y-1 sm:px-10 sm:py-10"
      >
        <span>
          <span className="block text-sm font-medium">Next project</span>
          <span className="mt-1 block font-display text-2xl leading-tight font-bold tracking-tight sm:text-4xl">
            {next.title}
          </span>
        </span>
        <ArrowRight
          size={32}
          weight="bold"
          aria-hidden
          className="shrink-0 transition-transform group-hover:translate-x-1"
        />
      </Link>
    </article>
  );
}
