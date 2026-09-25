import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Abel Goh: Electronics & Computer Engineering student at Nanyang Polytechnic, Singapore, interning at NIT Nara College.",
};

const facts = [
  ["Studying", "Electronics & Computer Engineering, Nanyang Polytechnic, Singapore"],
  ["Now", "Intern at NIT Nara College, Japan"],
  ["Next", "Aiming for Electrical & Electronic Engineering at NTU"],
  ["Languages", "English, Chinese, Japanese (learning, 勉強中)"],
  ["Code", "Python, C, C#, HTML, CSS, JavaScript, Linux and the command line"],
  ["Lately", "PyTorch, Stable-Baselines3, Gymnasium, ROS 2, Gazebo"],
];

export default function AboutPage() {
  return (
    <div className="pt-14 sm:pt-24">
      <p className="font-mono text-[13px] text-muted">About</p>
      <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
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

          <h2 className="pt-6 font-serif text-2xl tracking-tight">
            How I approach a problem
          </h2>
          <p>
            I break it into manageable parts and try to understand it before
            jumping to a solution. During the internship that turned into a
            habit of running a control: when a change seemed to help, I trained
            the same model without it to see whether the change or just the
            extra training was responsible. More than once it was the training.
          </p>
          <p>
            Mistakes are part of the process. Every entry in my daily log has
            a section for what confused me, next to what I figured out.
          </p>

          <h2 className="pt-6 font-serif text-2xl tracking-tight">
            Outside of engineering
          </h2>
          <p>
            Bowling is my competitive sport. I&rsquo;ve played since I was
            young and seriously for the last year and a half. My proudest
            moment is converting a Greek Church split (the 4-6-7-9-10). I&rsquo;ve
            also played badminton casually for about 7 to 8 years. Both have
            taught me precision, strategy and focus, and I bring those into how
            I work.
          </p>

          <h2 className="pt-6 font-serif text-2xl tracking-tight">
            Looking ahead
          </h2>
          <p>
            I want to take on more complex projects, work with other people, and
            apply what I learn to real problems. Next up is getting my
            navigation policy onto a real TurtleBot3 and seeing how much of the
            simulator result survives contact with an actual floor.
          </p>
        </div>

        <aside>
          <dl className="divide-y divide-line border-y border-line">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5">
                <dt className="font-mono text-xs leading-6 text-muted">{k}</dt>
                <dd className="leading-6">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/#work"
            className="mt-6 inline-block font-medium underline decoration-line hover:decoration-accent"
          >
            See the projects →
          </Link>
        </aside>
      </div>
    </div>
  );
}
