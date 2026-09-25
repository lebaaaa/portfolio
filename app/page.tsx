import Image from "next/image";
import Link from "next/link";
import { ProjectList } from "@/components/project-list";
import { earlierProjects, getProject, rlProjects } from "@/lib/projects";

const clips = [
  { slug: "car-racing", label: "CarRacing, final model" },
  { slug: "lunar-lander", label: "LunarLander, PPO" },
  { slug: "frozen-lake", label: "FrozenLake, my Q-table" },
];

export default function Home() {
  const featured = getProject("turtlebot3-lidar-robot")!;

  return (
    <>
      <section className="pt-14 pb-16 sm:pt-24 sm:pb-20">
        <p className="font-mono text-[13px] text-muted">
          Singapore · currently in Nara, Japan
        </p>
        <h1 className="mt-5 max-w-4xl font-serif text-[2.1rem] leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.08]">
          I&rsquo;m Abel, an Electronics &amp; Computer Engineering student at
          Nanyang Polytechnic. Right now I&rsquo;m interning at NIT Nara
          College, using reinforcement learning to teach a simulated race car and a LiDAR robot to drive themselves.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          These are the projects, with the numbers and the parts that
          didn&rsquo;t work the first time.
        </p>
      </section>

      <section aria-label="Clips of trained agents">
        <div className="grid grid-cols-[1.5fr_1fr] gap-3 sm:grid-cols-[1.714fr_1.5fr_1fr] sm:gap-4">
          {clips.map((c) => {
            const p = getProject(c.slug)!;
            const m = p.media!;
            return (
              <Link
                key={c.slug}
                href={`/projects/${c.slug}`}
                className={`group block ${c.slug === "car-racing" ? "col-span-2 sm:col-span-1" : ""}`}
              >
                <div className="overflow-hidden rounded-sm border border-line bg-black">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    width={m.width}
                    height={m.height}
                    unoptimized
                    loading="eager"
                    className="h-auto w-full transition-opacity group-hover:opacity-90"
                    style={m.pixelated ? { imageRendering: "pixelated" } : undefined}
                  />
                </div>
                <p className="mt-2 font-mono text-xs text-muted group-hover:text-fg">
                  {c.label} →
                </p>
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted">
          Recorded from the trained models, not edited.
        </p>
      </section>

      <section className="mt-24 sm:mt-32">
        <p className="font-mono text-[13px] text-muted">Latest</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <h2 className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
              <Link
                href={`/projects/${featured.slug}`}
                className="decoration-accent decoration-1 underline-offset-4 hover:underline"
              >
                {featured.title}
              </Link>
            </h2>
            <p className="mt-4 leading-relaxed">{featured.intro}</p>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {featured.stats!.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[10.5rem_1fr] items-baseline gap-4 py-3"
                >
                  <dt className="font-mono text-base whitespace-nowrap tabular-nums sm:text-lg">{s.value}</dt>
                  <dd className="text-sm text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={`/projects/${featured.slug}`}
              className="mt-6 inline-block font-medium underline decoration-line hover:decoration-accent"
            >
              Read the write-up →
            </Link>
          </div>
          <figure>
            <div className="overflow-hidden rounded-sm border border-line bg-[#fcfcfa]">
              <Image
                src="/figures/4_trajectories.png"
                alt="Two top-down room plans with the same start and goal. The wall-arm robot drives into a box and crashes after 66 steps. The graded-arm robot takes the same route and stays pressed against the box for 300 steps."
                width={1448}
                height={729}
                sizes="(min-width: 1024px) 600px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-2 text-sm text-muted">
              Same start, two reward designs. One crashes, the other gets
              stuck.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="work" className="mt-24 scroll-mt-8 sm:mt-32">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-3xl tracking-tight">
            Reinforcement learning
          </h2>
          <p className="font-mono text-xs text-muted">
            Sep 2026 · self-study during my internship
          </p>
        </div>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Newest first. Read from the bottom up, each one picks up where the
          last ran out: a library agent, then Q-learning by hand, my own
          environment, pixels, and finally a robot.
        </p>
        <div className="mt-8">
          <ProjectList projects={rlProjects} />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-3xl tracking-tight">Earlier projects</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Embedded systems, desktop and web projects.
        </p>
        <div className="mt-8">
          <ProjectList projects={earlierProjects} start={rlProjects.length + 1} />
        </div>
      </section>

      <section className="mt-24 grid gap-6 sm:mt-32 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <h2 className="font-serif text-3xl leading-tight tracking-tight">
          Curious, methodical, and driven to build things that work.
        </h2>
        <div className="leading-relaxed">
          <p>
            I learn by building. I break a problem into parts, try to
            understand it before jumping to a fix, and treat mistakes as the
            useful part. My daily logs from the internship are mostly lists
            of what confused me and what I figured out.
          </p>
          <p className="mt-4">
            Outside of engineering I bowl competitively and play badminton.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block font-medium underline decoration-line hover:decoration-accent"
          >
            More about me →
          </Link>
        </div>
      </section>
    </>
  );
}
