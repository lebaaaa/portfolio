import { codeToHtml, createCssVariablesTheme } from "shiki";
import { snippets } from "@/lib/snippets";

// Colours come from the --shiki-* variables in globals.css, so code matches
// the site palette. Highlighting runs at build time; no JS ships for it.
const theme = createCssVariablesTheme({
  name: "site",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

export async function CodeSnippet({
  id,
  caption,
}: {
  id: string;
  caption?: string;
}) {
  const s = snippets[id];
  const end = s.start + s.code.split("\n").length - 1;
  const html = await codeToHtml(s.code, { lang: "python", theme });

  return (
    <figure>
      <div className="overflow-hidden rounded-sm bg-band text-band-fg">
        <div className="flex items-baseline justify-between gap-4 border-b border-band-line px-4 py-2 font-mono text-[11px] text-band-muted">
          <span className="truncate">{s.file}</span>
          <span className="shrink-0 tabular-nums">
            lines {s.start}–{end}
          </span>
        </div>
        <div
          className="code-snippet overflow-x-auto py-3 text-[13px] leading-[1.7]"
          style={{ counterReset: `line ${s.start - 1}` }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
