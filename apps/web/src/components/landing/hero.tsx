import { DOWNLOAD_URL, SITE } from "@/lib/constants";

import { CopyIpButton } from "./copy-ip-button";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] items-end justify-center overflow-hidden pb-16 pt-20 sm:items-center sm:pb-20 sm:pt-24">
      <img
        src="/hero.png"
        alt="Steamworks citadel under a brass sky: the world of Chronicles of All Creation"
        className="absolute inset-0 size-full object-cover object-center animate-hero-drift"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(6,8,16,0.7)_78%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <img
          src="/logo.png"
          alt={SITE.name}
          className="mb-6 w-full max-w-md drop-shadow-[0_12px_40px_rgba(6,8,16,0.75)] animate-fade-rise sm:mb-8 sm:max-w-lg"
        />
        <p className="mb-8 max-w-2xl font-display text-lg leading-[1.35] text-parchment/90 text-balance animate-fade-rise delay-150 sm:mb-10 sm:text-xl">
          {SITE.tagline}
        </p>
        <div className="flex flex-col items-center gap-3 animate-fade-rise delay-300 sm:flex-row sm:gap-4">
          <CopyIpButton />
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-parchment/35 px-6 py-3.5 font-display text-sm tracking-[0.12em] text-parchment uppercase transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold hover:text-gold active:scale-[0.98]"
          >
            Download modpack
          </a>
        </div>
      </div>
    </section>
  );
}
