"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

type Shot = NonNullable<Project["showcase"]>[number];

function LoopVideo({ shot }: { shot: Shot }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Autoplay, unless the visitor asked for reduced motion; then show controls instead.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      v.controls = true;
    } else {
      v.play().catch(() => {
        v.controls = true;
      });
    }
  }, []);

  return (
    <video
      ref={ref}
      src={shot.src}
      poster={shot.poster}
      width={shot.width}
      height={shot.height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={shot.alt}
      className="block h-auto w-full"
    />
  );
}

export function PhoneShowcase({
  shots,
  caption,
}: {
  shots: Shot[];
  caption?: string;
}) {
  return (
    <figure className="mt-12">
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="grid w-max grid-flow-col auto-cols-[11.5rem] gap-4 sm:w-full sm:auto-cols-fr">
          {shots.map((shot) => (
            <div key={shot.src}>
              <div className="overflow-hidden rounded-[1.4rem] border border-line bg-black">
                {shot.kind === "video" ? (
                  <LoopVideo shot={shot} />
                ) : (
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 1024px) 220px, 184px"
                    className="block h-auto w-full"
                  />
                )}
              </div>
              <p className="mt-2 font-mono text-xs text-muted">{shot.label}</p>
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 max-w-3xl text-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
