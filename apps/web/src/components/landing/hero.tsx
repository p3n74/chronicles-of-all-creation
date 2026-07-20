import { SITE } from "@/lib/constants";

import { CopyIpButton } from "./copy-ip-button";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden">
      <img
        src="/hero.png"
        alt=""
        className="absolute inset-0 size-full object-cover animate-hero-drift"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/60 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,8,16,0.55)_72%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-16 pt-24 text-center">
        <img
          src="/logo.png"
          alt={SITE.name}
          className="mb-8 w-full max-w-md drop-shadow-[0_12px_40px_rgba(0,0,0,0.65)] animate-fade-rise sm:max-w-lg"
        />
        <p className="mb-10 max-w-xl font-display text-lg leading-relaxed text-parchment/90 animate-fade-rise delay-150 sm:text-xl">
          {SITE.tagline}
        </p>
        <div className="animate-fade-rise delay-300">
          <CopyIpButton />
        </div>
        <a
          href="#about"
          className="mt-14 font-body text-xs tracking-[0.28em] text-steam uppercase transition hover:text-gold animate-fade-rise delay-500"
        >
          Begin the chronicle
        </a>
      </div>
    </section>
  );
}
