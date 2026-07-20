import { FEATURES } from "@/lib/constants";

import { Reveal } from "./reveal";

export function Features() {
  const [lead, ...rest] = FEATURES;

  return (
    <section id="features" className="relative scroll-mt-24 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <Reveal>
          <h2 className="max-w-2xl font-display text-3xl tracking-tight text-parchment text-balance sm:text-4xl">
            Three acts of one ascent
          </h2>
        </Reveal>

        {lead ? (
          <Reveal delayMs={60}>
            <div className="mt-14 border border-gold/15 bg-ink-soft/40 p-1.5">
              <article className="group grid items-center gap-10 border border-gold/10 bg-ink-soft/60 p-6 shadow-[inset_0_1px_0_rgba(233,226,208,0.05)] sm:p-10 lg:grid-cols-[200px_1fr] lg:gap-14">
                <div className="mx-auto flex size-28 items-center justify-center sm:size-36 lg:mx-0">
                  <img
                    src={lead.icon}
                    alt={lead.alt}
                    className="size-full object-contain transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 text-center lg:text-left">
                  <h3 className="font-display text-xl tracking-wide text-gold sm:text-2xl">
                    {lead.title}
                  </h3>
                  <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-parchment/70 sm:text-base lg:mx-0 mx-auto">
                    {lead.description}
                  </p>
                </div>
              </article>
            </div>
          </Reveal>
        ) : null}

        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((feature, i) => (
            <li key={feature.title}>
              <Reveal delayMs={100 + i * 70}>
                <article className="group flex h-full flex-col border border-gold/12 bg-ink-deep/40 p-6 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold/30 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
                  <div className="mb-4 flex size-16 shrink-0 items-center justify-center overflow-hidden sm:mb-0 sm:size-20">
                    <img
                      src={feature.icon}
                      alt={feature.alt}
                      className="size-full object-contain transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg tracking-wide text-gold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-parchment/68">
                      {feature.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
