import { Link } from "@tanstack/react-router";

import { QUEST_GROUPS, SITE } from "@/lib/constants";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-20 border-t border-gold/15 bg-ink-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,149,181,0.10),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="mb-4 font-display text-xs tracking-[0.35em] text-gold uppercase">About</p>
        <h2 className="mb-6 font-display text-3xl text-parchment sm:text-4xl">
          Every gear turns toward the stars.
        </h2>
        <p className="font-body text-base leading-relaxed text-parchment/75 sm:text-lg">
          {SITE.description}
        </p>

        <div className="mt-12">
          <p className="mb-5 font-display text-[0.65rem] tracking-[0.3em] text-steam uppercase">
            Questbook chapters include
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {QUEST_GROUPS.map((group) => (
              <li
                key={group}
                className="rounded-sm border border-gold/20 bg-ink px-3 py-1.5 font-body text-xs text-parchment/70"
              >
                {group}
              </li>
            ))}
          </ul>
          <Link
            to="/quests"
            className="mt-6 inline-block font-display text-xs tracking-[0.22em] text-gold uppercase transition hover:text-gold-bright"
          >
            Browse the full questlines →
          </Link>
        </div>
      </div>
    </section>
  );
}
