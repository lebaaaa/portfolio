import Image from "next/image";
import Link from "next/link";
import { LidarReplay } from "@/components/lidar-replay";
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
      <section className="grid items-center gap-12 pt-12 pb-16 sm:pt-20 sm:pb-20 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <p className="dot font-mono text-[13px] text-muted">
            Singapore · starting an internship at NIT Nara College, Japan
          </p>
          <h1 className="mt-5 font-serif text-[2.1rem] leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.08] lg:text-[2.9rem]">
            I&rsquo;m Abel, an Electronics &amp; Computer Engineering student at
            Nanyang Polytechnic in Singapore. In my own time I&rsquo;ve been
            teaching myself reinforcement learning by training{" "}
            <span className="mark">a simulated race car and a LiDAR robot</span>{" "}
            to drive themselves.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            These are the projects, with the numbers and the parts that
            didn&rsquo;t work the first time.
          </p>
          <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-gold" />
            Next: testing my navigation model on a real TurtleBot3
          </p>
        </div>
        <LidarReplay />
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
                <p className="mt-2 font-mono text-xs text-muted group-hover:text-accent">
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
        <p className="dot font-mono text-[13px] text-muted">Latest</p>
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
                  <dt className="font-mono text-base font-medium whitespace-nowrap text-accent tabular-nums sm:text-lg">
                    {s.value}
                  </dt>
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
          <p className="dot dot-gold font-mono text-xs text-muted">
            Sep 2026 · personal projects
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
          Mobile, embedded systems, desktop and web projects.
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
            useful part. My daily logs from these projects are mostly lists
            of what confused me and what I figured out.
          </p>
          <p className="mt-4">
            Outside of engineering I bowl competitively, play badminton and take photos.
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
