import type { Metadata } from "next";
import Image from "next/image";
import { ArchReveal } from "@/components/arch-reveal";
import { PillLink } from "@/components/pill-link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Abel Goh: Electronics & Computer Engineering student at Nanyang Polytechnic, Singapore, interning at NIT Nara College, Japan.",
};

const facts = [
  ["Studying", "Electronics & Computer Engineering, Nanyang Polytechnic, Singapore"],
  ["Now", "Intern at NIT Nara College, Japan"],
  ["After poly", "Aiming for Electrical & Electronic Engineering at NTU"],
  ["Languages", "English, Chinese, Japanese (learning, 勉強中)"],
  ["Code", "Python, C, C#, HTML, CSS, JavaScript, Linux and the command line"],
  ["Lately", "PyTorch, Stable-Baselines3, Gymnasium, ROS 2, Gazebo"],
];

// Rows are sized so both photos in a row end up the same height.
const PHOTO_ROWS = [
  [
    {
      src: "/photos/carpark-night.jpg",
      width: 1800,
      height: 967,
      alt: "A white SUV with its tail lights on, parked under a concrete canopy at night, next to a yellow barrier and traffic cones.",
    },
    {
      src: "/photos/window-dusk.jpg",
      width: 1800,
      height: 1350,
      alt: "A dark bedroom looking out through a barred window at apartment blocks against an orange dusk sky.",
    },
  ],
  [
    {
      src: "/photos/expressway-2.jpg",
      width: 1800,
      height: 781,
      alt: "An expressway in daylight, lined with tall green trees, with trucks, a car and a motorcyclist in the lanes.",
    },
    {
      src: "/photos/bench-sea.jpg",
      width: 1800,
      height: 1350,
      alt: "A person seen from behind on a bench between two palm trees, looking out over the sea at floating buildings on a hazy day.",
    },
  ],
];

// Pins left standing in a Greek Church split, rows from the back.
const PIN_ROWS = [
  [7, 8, 9, 10],
  [4, 5, 6],
  [2, 3],
  [1],
];
const STANDING = new Set([4, 6, 7, 9, 10]);

function GreekChurch() {
  return (
    <figure className="shrink-0">
      <div
        role="img"
        aria-label="Bowling pin diagram with pins 4, 6, 7, 9 and 10 standing."
        className="flex flex-col items-center gap-2"
      >
        {PIN_ROWS.map((row) => (
          <div key={row[0]} className="flex gap-2">
            {row.map((pin) => (
              <span
                key={pin}
                className={`h-6 w-6 rounded-full ${
                  STANDING.has(pin)
                    ? "bg-accent"
                    : "border border-line bg-transparent"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-center font-mono text-xs text-muted">
        4-6-7-9-10
      </figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-8 sm:pt-14">
      <h1 className="max-w-4xl font-display text-[clamp(2.4rem,5.2vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.03em]">
        Learning fast, building consistently, improving every project.
      </h1>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="max-w-2xl space-y-5 text-[17px] leading-relaxed">
          <p>
            I&rsquo;m a student with a strong interest in technology and
            engineering, and I learn best through hands-on projects. I&rsquo;m
            interested in how systems work, and in how small design choices
            affect the bigger picture.
          </p>
          <p>
            Rather than waiting until I &ldquo;know everything&rdquo;, I take on
            small projects, experiment, and look back at what worked and what
            didn&rsquo;t. Projects are where theory turns into practice for me,
            whether that&rsquo;s how systems communicate, how people use an
            interface, or how a small decision changes the final result.
          </p>

          <h2 className="pt-6 font-display text-2xl font-bold tracking-tight">
            How I approach a problem
          </h2>
          <p>
            I break it into manageable parts and try to understand it before
            jumping to a solution. In my reinforcement learning projects that turned into a
            habit of running a control: when a change seemed to help, I trained
            the same model without it to see whether the change or just the
            extra training was responsible. More than once it was the training.
          </p>
          <p>
            Mistakes are part of the process. Every entry in my daily log has
            a section for what confused me, next to what I figured out.
          </p>

          <h2 className="pt-6 font-display text-2xl font-bold tracking-tight">
            Outside of engineering
          </h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <p className="flex-1">
              Bowling is my competitive sport. I&rsquo;ve played since I was
              young and seriously for the last year and a half. My proudest
              moment is converting a Greek Church split (the 4-6-7-9-10).
              I&rsquo;ve also played badminton casually for about 7 to 8 years.
              Both have taught me precision, strategy and focus, and I bring
              those into how I work.
            </p>
            <GreekChurch />
          </div>
          <p>
            I also take photos. A few of them are{" "}
            <a
              href="#photography"
              className="underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              at the bottom of this page
            </a>
            .
          </p>

          <h2 className="pt-6 font-display text-2xl font-bold tracking-tight">
            Looking ahead
          </h2>
          <p>
            I want to take on more complex projects, work with other people, and
            apply what I learn to real problems. My navigation policy has now
            driven a real robot once, a FastBot in a remote lab, and reached 3 of
            5 goals. Next is a longer test with a proper success rate, ideally
            on a real TurtleBot3.
          </p>
        </div>

        {/* Card and button stick together, just below the sticky header. */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <dl className="space-y-5 rounded-2xl bg-band p-6 text-band-fg sm:p-7">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-xs font-medium text-gold">{k}</dt>
                <dd className="mt-1 leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
          <PillLink href="/#work" tone="dark" className="mt-5">
            Projects
          </PillLink>
        </aside>
      </div>

      <section id="photography" className="mt-24 scroll-mt-8">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Things I stopped to look at
        </h2>
        <div className="mt-8 space-y-3 sm:space-y-4">
          {PHOTO_ROWS.map((row, r) => (
            <div
              key={r}
              className="grid gap-3 sm:grid-cols-(--cols) sm:gap-4"
              style={
                {
                  "--cols": row
                    .map((p) => `${(p.width / p.height).toFixed(3)}fr`)
                    .join(" "),
                } as React.CSSProperties
              }
            >
              {row.map((p) => (
                <ArchReveal key={p.src}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 640px) 60vw, 100vw"
                  className="h-auto w-full rounded-2xl"
                />
                </ArchReveal>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
