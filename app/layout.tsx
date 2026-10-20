import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PillLink } from "@/components/pill-link";
import { SiteNav } from "@/components/site-nav";
import { SmoothScroll } from "@/components/smooth-scroll";
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

        <SmoothScroll />
        <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-8">
          <Link
            href="/"
            className="shrink-0 font-display text-lg font-bold tracking-tight whitespace-nowrap sm:text-xl"
          >
            Abel Goh
            <span lang="ja" className="ml-1.5 font-sans text-xs font-medium text-accent-ink sm:ml-2 sm:text-sm">
              アベル
            </span>
          </Link>
          <SiteNav />
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer id="contact" className="mt-28 scroll-mt-20 bg-band text-band-fg">
          <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:px-8 sm:pt-24">
            <h2 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Curious about a project, or want to work on something together?
            </h2>
            <PillLink href={`mailto:${site.email}`} tone="gold" dir="out" className="mt-10">
              {site.email}
            </PillLink>
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
