import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { LidarReplay } from "@/components/lidar-replay";
import { Reveal } from "@/components/reveal";
import { WorkBento } from "@/components/work-bento";
import { earlierProjects } from "@/lib/projects";

// Every number here comes from the project write-ups.
const highlights = [
  { value: "849", label: "mean reward across 30 random CarRacing tracks", href: "/projects/car-racing" },
  { value: "59/60", label: "Gazebo runs that matched my own simulator", href: "/projects/turtlebot3-lidar-robot" },
  { value: "3/5", label: "goals reached on a real robot, driven remotely", href: "/projects/turtlebot3-lidar-robot" },
  { value: "58/58", label: "GridWorld start cells solved by PPO and DQN", href: "/projects/gridworld" },
];

const container = "mx-auto w-full max-w-6xl px-4 sm:px-8";

export default function Home() {
  return (
    <>
      <section className={`${container} pt-6 pb-20 sm:pt-10 sm:pb-24`}>
        <Reveal>
          <h1 className="max-w-5xl font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.98] font-bold tracking-[-0.03em]">
            I teach cars and robots to{" "}
            <span className="mark">drive themselves.</span>
          </h1>
        </Reveal>

        <div className="mt-10 grid items-start gap-12 lg:mt-12 lg:grid-cols-[1fr_minmax(0,25rem)] lg:gap-16">
          <Reveal delay={0.08}>
            <p className="max-w-md text-lg leading-relaxed text-muted sm:text-xl">
              Electronics &amp; Computer Engineering student at Nanyang
              Polytechnic, now interning at NIT Nara College in Japan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-on-color transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Projects
                <ArrowDown size={16} weight="bold" aria-hidden />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium ring-1 ring-line transition-[background-color,transform] ring-inset hover:-translate-y-0.5 hover:bg-panel active:translate-y-0"
              >
                Contact
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <LidarReplay />
          </Reveal>
        </div>
      </section>

      <section aria-label="Highlights" className="bg-accent text-on-color">
        <div className={`${container} grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4 lg:py-16`}>
          {highlights.map((h, i) => (
            <Reveal key={h.label} delay={i * 0.06}>
              <Link href={h.href} className="group block">
                <p className="font-display text-5xl leading-none font-bold tracking-tight tabular-nums sm:text-6xl">
                  {h.value}
                </p>
                <p className="mt-3 max-w-[16rem] text-sm leading-snug font-medium">
                  {h.label}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden
                    className="ml-1 inline align-[-2px] transition-transform group-hover:translate-x-0.5"
                  />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="work" className={`${container} scroll-mt-4 pt-24 sm:pt-32`}>
        <Reveal>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Reinforcement learning
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
            Personal projects from September 2026, newest first. Each one picks
            up where the last ran out, and every write-up includes what broke.
          </p>
        </Reveal>
        <div className="mt-10">
          <WorkBento />
        </div>
      </section>

      <section className={`${container} pt-24 sm:pt-32`}>
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Earlier projects
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {earlierProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link
                href={`/projects/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-panel p-6 ring-1 ring-line transition-[transform,box-shadow] ring-inset hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgb(22_33_62/0.35)] sm:p-7"
              >
                <p className="font-mono text-xs font-medium text-accent-ink">
                  {p.when ?? p.role}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{p.short}</p>
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  aria-hidden
                  className="mt-5 self-end transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${container} pt-24 sm:pt-32`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              Curious, methodical, and driven to build things that work.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              I learn by building, and my daily logs are mostly lists of what
              confused me and what I figured out. Outside of engineering I bowl
              competitively, play badminton and take photos.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium ring-1 ring-line transition-[background-color,transform] ring-inset hover:-translate-y-0.5 hover:bg-panel"
            >
              About me
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-[1.25fr_1fr] items-end gap-4">
            <Image
              src="/photos/window-dusk.jpg"
              alt="A dark bedroom looking out through a barred window at apartment blocks against an orange dusk sky."
              width={1800}
              height={1350}
              sizes="(min-width: 1024px) 320px, 55vw"
              className="h-auto w-full rounded-2xl"
            />
            <Image
              src="/photos/carpark-night.jpg"
              alt="A white SUV with its tail lights on, parked under a concrete canopy at night."
              width={1800}
              height={967}
              sizes="(min-width: 1024px) 260px, 45vw"
              className="mb-10 h-auto w-full rounded-2xl"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
