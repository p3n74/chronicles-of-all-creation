import { SITE } from "@/lib/constants";

import { Reveal } from "./reveal";

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 border-t border-gold/15 bg-ink-soft"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,150,46,0.06),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36 lg:pr-[18vw]">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl leading-[1.15] tracking-tight text-parchment text-balance sm:text-4xl lg:text-[2.75rem]">
            Every gear turns toward the stars.
          </h2>
        </Reveal>
        <Reveal delayMs={80}>
          <p className="mt-8 max-w-[65ch] font-body text-base leading-relaxed text-parchment/72 sm:text-lg">
            {SITE.description}
          </p>
        </Reveal>
      </div>
      <div className="blueprint-rule mx-auto max-w-6xl" aria-hidden />
    </section>
  );
}
