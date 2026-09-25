import Image from "next/image";
import { CodeSnippet } from "@/components/code-snippet";
import type { Block, Media } from "@/lib/projects";

// Renders `code` spans inside otherwise plain text.
export function Rich({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="inline-code">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Clip({ media, eager }: { media: Media; eager?: boolean }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-sm border border-line bg-black">
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          unoptimized
          loading={eager ? "eager" : "lazy"}
          className="h-auto w-full"
          style={media.pixelated ? { imageRendering: "pixelated" } : undefined}
        />
      </div>
      <figcaption className="mt-2 text-sm text-muted">{media.caption}</figcaption>
    </figure>
  );
}

function GridWorld() {
  const cells = Array.from({ length: 25 }, (_, i) => {
    if (i === 0) return "A";
    if (i === 12) return "X";
    if (i === 24) return "G";
    return "";
  });
  return (
    <figure className="my-2">
      <div
        className="grid w-full max-w-[16rem] grid-cols-5 border-t border-l border-line font-mono text-sm"
        role="img"
        aria-label="5 by 5 grid. The agent A starts in the top-left cell, the goal G is in the bottom-right cell and a trap X is in the centre."
      >
        {cells.map((c, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center border-r border-b border-line ${
              c === "X"
                ? "bg-accent/15 text-accent"
                : c === "G"
                  ? "bg-fg text-bg"
                  : c === "A"
                    ? "font-medium"
                    : ""
            }`}
          >
            {c}
          </div>
        ))}
      </div>
      <figcaption className="mt-2 text-sm text-muted">
        The first layout: A starts top-left, G is the goal, X is the trap.
      </figcaption>
    </figure>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="leading-relaxed">
                <Rich text={b.text} />
              </p>
            );
          case "list":
            return (
              <ul key={i} className="space-y-3">
                {b.items.map((item, j) => (
                  <li key={j} className="relative pl-5 leading-relaxed">
                    <span
                      aria-hidden
                      className="absolute top-[0.7em] left-0 h-px w-2.5 bg-muted"
                    />
                    <Rich text={item} />
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-accent py-1 pl-5 font-serif text-xl leading-snug"
              >
                {b.text}
              </blockquote>
            );
          case "table":
            return (
              <figure key={i}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b-2 border-fg">
                        {b.head.map((h, j) => (
                          <th
                            key={j}
                            scope="col"
                            className="py-2 pr-4 align-bottom font-mono text-xs font-medium text-muted"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, r) => (
                        <tr key={r} className="border-b border-line">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`py-2.5 pr-4 align-top ${
                                c === 0 ? "" : "tabular-nums"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.caption && (
                  <figcaption className="mt-2 text-sm text-muted">
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "figure":
            return (
              <figure key={i}>
                <div className="overflow-hidden rounded-sm border border-line bg-[#fcfcfa]">
                  <Image
                    src={b.src}
                    alt={b.alt}
                    width={b.width}
                    height={b.height}
                    sizes="(min-width: 1024px) 700px, 100vw"
                    className={`h-auto ${b.width < 1000 ? "mx-auto w-full max-w-md" : "w-full"}`}
                  />
                </div>
                <figcaption className="mt-2 text-sm text-muted">
                  {b.caption}
                </figcaption>
              </figure>
            );
          case "gridworld":
            return <GridWorld key={i} />;
          case "code":
            return <CodeSnippet key={i} id={b.id} caption={b.caption} />;
        }
      })}
    </div>
  );
}
