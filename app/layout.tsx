import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} ${serif.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-baseline justify-between px-4 pt-6 pb-4 sm:px-8 sm:pt-8">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight no-underline"
          >
            Abel Goh
          </Link>
          <nav className="flex gap-5 font-mono text-[13px] text-muted sm:gap-7">
            <Link href="/#work" className="hover:text-fg">
              Work
            </Link>
            <Link href="/about" className="hover:text-fg">
              About
            </Link>
            <Link href="#contact" className="hover:text-fg">
              Contact
            </Link>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8">
          {children}
        </main>

        <footer
          id="contact"
          className="mx-auto mt-28 w-full max-w-6xl scroll-mt-8 px-4 pb-10 sm:px-8"
        >
          <div className="border-t border-line pt-10">
            <p className="font-mono text-[13px] text-muted">Contact</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">
              Curious about a project, or want to work on something together?
              Message me.
            </h2>
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {site.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-baseline gap-1.5 font-medium underline decoration-line hover:decoration-accent"
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </a>
                  <p className="mt-1 text-sm text-muted">{l.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-16 font-mono text-xs text-muted">
              © 2026 Abel Goh · Singapore
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
