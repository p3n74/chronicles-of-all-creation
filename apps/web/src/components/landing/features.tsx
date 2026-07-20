import { FEATURES } from "@/lib/constants";

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-20 border-t border-gold/15 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mb-16 text-center">
          <p className="mb-4 font-display text-xs tracking-[0.35em] text-gold uppercase">
            Features
          </p>
          <h2 className="font-display text-3xl text-parchment sm:text-4xl">
            Three acts of one ascent
          </h2>
        </div>

        <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="group text-center">
              <div className="mx-auto mb-5 flex size-20 items-center justify-center transition duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(201,162,39,0.25)]">
                <img
                  src={feature.icon}
                  alt={feature.alt}
                  className="size-full object-contain"
                  loading="lazy"
                />
              </div>
              <h3 className="mb-3 font-display text-lg tracking-wide text-gold">{feature.title}</h3>
              <p className="font-body text-sm leading-relaxed text-parchment/70">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
