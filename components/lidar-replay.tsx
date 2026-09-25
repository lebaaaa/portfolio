"use client";

import { useEffect, useState } from "react";
import episode from "@/lib/episode-90023.json";

// Replays one real test episode of the TurtleBot3 model (wall arm, +400k
// hard-start steps) at its true rate of 5 decisions a second. Walls, path and
// LiDAR sectors were recorded from BurgerEnv; nothing here is simulated.

const S = 100; // SVG units per metre
const room = episode.room * S;
const steps = episode.steps;
const HOLD = 12; // extra ticks to pause on the goal before looping

const pt = (x: number, y: number) => `${(x * S).toFixed(1)},${(room - y * S).toFixed(1)}`;

export function LidarReplay() {
  // -1 until the replay starts; reduced-motion visitors keep a still frame.
  const [tick, setTick] = useState(-1);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % (steps + HOLD));
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  const playing = tick >= 0;
  const step = playing ? Math.min(tick, steps - 1) : Math.floor(steps * 0.55); // index into scans
  const [lx, ly] = episode.lidar[step];
  const rays = episode.rays[step];
  const [bx, by] = episode.path[step + 1];
  const h = episode.heading[step];
  const done = tick >= steps - 1;
  const trail = episode.path
    .slice(0, step + 2)
    .map(([x, y]) => pt(x, y))
    .join(" ");

  return (
    <figure>
      <div className="relative overflow-hidden rounded-sm bg-band">
        <svg
          viewBox={`-12 -12 ${room + 24} ${room + 24}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Top-down replay of my robot model crossing a 5 by 5 metre room with five box obstacles to reach the goal in ${steps} decisions, with its LiDAR beams drawn in gold.`}
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M50 0H0V50" fill="none" stroke="var(--band-line)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width={room} height={room} fill="url(#grid)" />

          {rays.length > 0 &&
            Array.from({ length: rays.length / 2 }, (_, i) => (
              <line
                key={i}
                x1={lx * S}
                y1={room - ly * S}
                x2={rays[2 * i] * S}
                y2={room - rays[2 * i + 1] * S}
                stroke="var(--gold)"
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />
            ))}

          {episode.walls.map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1 * S}
              y1={room - y1 * S}
              x2={x2 * S}
              y2={room - y2 * S}
              stroke="var(--band-fg)"
              strokeWidth={i < 4 ? 5 : 3.5}
              strokeLinecap="square"
            />
          ))}

          <circle
            cx={episode.goal[0] * S}
            cy={room - episode.goal[1] * S}
            r="14"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="3"
          />
          <circle
            cx={episode.path[0][0] * S}
            cy={room - episode.path[0][1] * S}
            r="5"
            fill="none"
            stroke="var(--band-muted)"
            strokeWidth="2"
          />

          <polyline
            points={trail}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <circle cx={bx * S} cy={room - by * S} r={10.5} fill="var(--accent)" />
          <line
            x1={bx * S}
            y1={room - by * S}
            x2={(bx + 0.17 * Math.cos(h)) * S}
            y2={room - (by + 0.17 * Math.sin(h)) * S}
            stroke="var(--band-fg)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <figcaption className="mt-2 flex items-start justify-between gap-4 text-sm text-muted">
        <span>
          A real run of my robot model on test layout {episode.layout}, replayed
          at its actual 5 decisions a second. Gold lines are what its LiDAR sees.
        </span>
        <span className="shrink-0 pt-0.5 font-mono text-xs text-accent tabular-nums">
          {playing
            ? done
              ? "goal ✓"
              : `${String(step + 1).padStart(3, "0")} / ${steps}`
            : `${steps} steps`}
        </span>
      </figcaption>
    </figure>
  );
}
