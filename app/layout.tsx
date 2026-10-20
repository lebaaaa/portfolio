import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · Portfolio`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} · Portfolio`,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1124" },
  ],
};

const nav = [
  { href: "/#work", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-medium text-on-color focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>

        <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight"
          >
            Abel Goh
            <span lang="ja" className="ml-2 font-sans text-sm font-medium text-accent-ink">
              アベル
            </span>
          </Link>
          <nav aria-label="Main" className="flex gap-1 text-sm font-medium sm:gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-panel hover:text-fg"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer id="contact" className="mt-28 scroll-mt-4 bg-band text-band-fg">
          <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:px-8 sm:pt-24">
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Curious about a project, or want to work on something together?
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="group mt-10 inline-flex max-w-full items-center gap-3 rounded-full bg-gold px-6 py-3.5 font-medium text-on-color transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="truncate">{site.email}</span>
              <ArrowUpRight
                size={18}
                weight="bold"
                aria-hidden
                className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <ul className="mt-16 grid gap-x-8 gap-y-6 border-t border-band-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {site.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-medium hover:text-gold"
                  >
                    {l.label}
                    <ArrowUpRight
                      size={14}
                      weight="bold"
                      aria-hidden
                      className="text-band-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                    />
                  </a>
                  <p className="mt-1 text-sm text-band-muted">{l.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-16 text-sm text-band-muted">
              © 2026 Abel Goh. Singapore, currently in Nara.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
