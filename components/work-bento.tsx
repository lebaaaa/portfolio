import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ArchReveal } from "@/components/arch-reveal";
import { LoopVideo } from "@/components/loop-video";
import { Reveal } from "@/components/reveal";
import { KeepHyphens } from "@/components/keep-hyphens";
import { getProject } from "@/lib/projects";

type Tone = "navy" | "coral" | "gold" | "panel";

type Tile = {
  slug: string;
  span: string;
  tone: Tone;
  layout: "stack" | "row" | "tall";
  media:
    | {
        kind: "video";
        src: string;
        poster: string;
        w: number;
        h: number;
        fit: "cover" | "contain";
        pixelated?: boolean;
        bg: string;
        label: string;
      }
    | {
        kind: "image";
        src: string;
        w: number;
        h: number;
        bg: string;
        alt: string;
      };
  aspect?: string;
};

// Five projects, five cells. The TurtleBot3 tile is the tall one because it's
// the newest and the only one that ran on a real robot.
const rlTiles: Tile[] = [
  {
    slug: "turtlebot3-lidar-robot",
    span: "lg:col-span-7 lg:row-span-2",
    tone: "navy",
    layout: "tall",
    media: {
      kind: "video",
      src: "/media/fastbot-run5.mp4",
      poster: "/media/fastbot-run5-poster.jpg",
      w: 500,
      h: 500,
      fit: "contain",
      bg: "#fcfcfb",
      label:
        "The real FastBot robot, seen through its own LiDAR, driving into the goal circle.",
    },
  },
  {
    slug: "car-racing",
    span: "lg:col-span-5",
    tone: "coral",
    layout: "stack",
    aspect: "aspect-[16/9]",
    media: {
      kind: "video",
      src: "/media/car.mp4",
      poster: "/media/car-poster.jpg",
      w: 840,
      h: 490,
      fit: "cover",
      bg: "#6fd06f",
      label: "The trained car following a grey track through green grass.",
    },
  },
  {
    slug: "lunar-lander",
    span: "lg:col-span-5",
    tone: "panel",
    layout: "stack",
    aspect: "aspect-[16/9]",
    media: {
      kind: "video",
      src: "/media/lunar.mp4",
      poster: "/media/lunar-poster.jpg",
      w: 960,
      h: 640,
      fit: "cover",
      bg: "#000000",
      label: "The trained lander settling between two flags.",
    },
  },
  {
    slug: "frozen-lake",
    span: "lg:col-span-6",
    tone: "gold",
    layout: "row",
    media: {
      kind: "video",
      src: "/media/frozen.mp4",
      poster: "/media/frozen-poster.jpg",
      w: 720,
      h: 720,
      fit: "cover",
      pixelated: true,
      bg: "#dfe9f3",
      label:
        "The elf crossing the frozen lake to the present, following my Q-table.",
    },
  },
  {
    slug: "gridworld",
    span: "lg:col-span-6",
    tone: "panel",
    layout: "row",
    media: {
      kind: "image",
      src: "/figures/grid_distance.png",
      w: 780,
      h: 780,
      bg: "#fcfcfa",
      alt: "An 8 by 8 grid where each cell shows its distance to the goal.",
    },
  },
];

// Side projects since arriving in Nara, side by side.
const naraTiles: Tile[] = [
  {
    slug: "gomi-rubbish-app",
    span: "lg:col-span-6",
    tone: "gold",
    layout: "stack",
    aspect: "aspect-[16/10]",
    media: {
      kind: "image",
      src: "/media/gomi-tile.jpg",
      w: 1600,
      h: 1000,
      bg: "#f7f1e3",
      alt: "Three screens of the Gomi app: this week's collections, a search for battery, and the button battery page.",
    },
  },
  {
    slug: "rl-trading",
    span: "lg:col-span-6",
    tone: "panel",
    layout: "stack",
    aspect: "aspect-[16/10]",
    media: {
      kind: "image",
      src: "/figures/trading_sweep.png",
      w: 1350,
      h: 825,
      bg: "#fcfcfa",
      alt: "Chart of how strong a hidden trend has to be before PPO beats a moving-average rule.",
    },
  },
];

const sets = { rl: rlTiles, nara: naraTiles };

const tone: Record<Tone, { box: string; meta: string }> = {
  navy: { box: "bg-band text-band-fg", meta: "text-band-muted" },
  coral: { box: "bg-accent text-on-color", meta: "text-on-color" },
  gold: { box: "bg-gold text-on-color", meta: "text-on-color" },
  panel: { box: "bg-panel text-fg ring-1 ring-line", meta: "text-muted" },
};

function Media({ tile }: { tile: Tile }) {
  const m = tile.media;
  const frame =
    tile.layout === "tall"
      ? "aspect-square lg:aspect-auto lg:flex-1 lg:min-h-0"
      : tile.layout === "row"
        ? "aspect-square"
        : (tile.aspect ?? "aspect-video");
  return (
    <ArchReveal radius={12} className={`relative ${frame}`}>
      <div
        className="relative h-full w-full overflow-hidden rounded-xl"
        style={{ backgroundColor: m.bg }}
      >
        {m.kind === "video" ? (
          <LoopVideo
            src={m.src}
            poster={m.poster}
            width={m.w}
            height={m.h}
            label={m.label}
            fit={m.fit}
            pixelated={m.pixelated}
            className="h-full w-full"
          />
        ) : (
          <Image
            src={m.src}
            alt={m.alt}
            width={m.w}
            height={m.h}
            sizes={
              tile.layout === "row"
                ? "(min-width: 1024px) 260px, 50vw"
                : "(min-width: 1024px) 540px, 100vw"
            }
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </ArchReveal>
  );
}

export function WorkBento({ set = "rl" }: { set?: keyof typeof sets }) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
      {sets[set].map((tile, i) => {
        const p = getProject(tile.slug)!;
        const t = tone[tile.tone];
        return (
          <Reveal key={tile.slug} delay={i * 0.06} className={tile.span}>
            <article
              className={`group relative flex h-full flex-col gap-4 rounded-2xl p-3 transition-transform duration-300 hover:-translate-y-1 ${t.box} ${
                tile.layout === "row"
                  ? "sm:grid sm:grid-cols-[minmax(0,0.7fr)_1fr] sm:items-center"
                  : ""
              }`}
            >
              <Media tile={tile} />
              <div
                className={`flex flex-col px-2 pb-2 sm:px-3 ${tile.layout === "tall" ? "" : "flex-1"}`}
              >
                <p className={`font-mono text-xs font-medium ${t.meta}`}>
                  {p.when}
                </p>
                <h3
                  className={`mt-2 font-display leading-tight font-bold tracking-tight ${tile.layout === "row" ? "text-2xl" : "text-2xl sm:text-[1.75rem]"}`}
                >
                  <Link
                    href={`/projects/${p.slug}`}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
                  >
                    <KeepHyphens text={p.title} />
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed opacity-90">
                  {p.short}
                </p>
                <ArrowUpRight
                  size={22}
                  weight="bold"
                  aria-hidden
                  className="mt-4 self-end transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-accent ring-offset-2 ring-offset-bg group-has-[a:focus-visible]:ring-2"
              />
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
