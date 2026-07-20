import { Link } from "@tanstack/react-router";

import { QUEST_GROUPS } from "@/lib/constants";

import { Reveal } from "./reveal";

export function Questlines() {
  return (
    <section
      id="questlines"
      className="relative scroll-mt-24 border-t border-gold/15 bg-ink-soft"
    >
      <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
          <Reveal>
            <div>
              <h2 className="max-w-md font-display text-3xl tracking-tight text-parchment text-balance sm:text-4xl">
                The questbook is the map
              </h2>
              <p className="mt-5 max-w-md font-body text-base leading-relaxed text-parchment/68">
                Nine chapter books, from Session Zero to off-world charters. Browse the live
                graph the way FTB Quests lays it out in-game.
              </p>
              <Link
                to="/quests"
                className="mt-8 inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-5 py-3 font-display text-xs tracking-[0.18em] text-gold uppercase transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-gold hover:text-ink active:scale-[0.98]"
              >
                Questlines
              </Link>
            </div>
          </Reveal>

          <ul className="grid grid-cols-2 gap-px border border-gold/15 bg-gold/10 sm:grid-cols-3">
            {QUEST_GROUPS.map((group, i) => (
              <li key={group.title} className="bg-ink-soft">
                <Reveal delayMs={40 + i * 40} className="h-full">
                  <Link
                    to="/quests"
                    className="group flex h-full flex-col items-center gap-3 px-4 py-6 text-center transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-ink"
                  >
                    <img
                      src={group.icon}
                      alt=""
                      className="size-9 object-contain transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      style={{ imageRendering: "pixelated" }}
                      loading="lazy"
                    />
                    <span className="font-display text-[0.65rem] leading-snug tracking-[0.1em] text-parchment/70 uppercase transition duration-300 group-hover:text-gold">
                      {group.title}
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
