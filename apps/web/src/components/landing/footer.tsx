import { Download } from "lucide-react";

import { ALT_SERVER_IP, DOWNLOAD_URL, SERVER_IP, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer id="download" className="scroll-mt-24 border-t border-gold/20 bg-ink-deep">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <p className="font-display text-xl tracking-wide text-parchment sm:text-2xl">
              {SITE.name}
            </p>
            <p className="mt-3 font-body text-sm text-parchment/55">
              Join at <span className="text-gold">{SERVER_IP}</span>
            </p>
            <p className="mt-1 font-body text-xs text-parchment/40">
              Direct: <span className="text-parchment/60">{ALT_SERVER_IP}</span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <a
              href={DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-gold/45 bg-gold px-6 py-3.5 font-display text-xs font-semibold tracking-[0.18em] text-ink uppercase transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-gold-bright active:scale-[0.98]"
            >
              <Download className="size-4" aria-hidden />
              Download modpack
            </a>
            <p className="max-w-xs font-body text-xs text-parchment/45 lg:text-right">
              Latest build on Google Drive. Drop it in your launcher and connect.
            </p>
          </div>
        </div>

        <div className="blueprint-rule" aria-hidden />

        <section id="rules" className="max-w-2xl scroll-mt-24">
          <h2 className="mb-3 font-display text-sm tracking-[0.18em] text-gold uppercase">
            Server rules
          </h2>
          <p className="font-body text-sm leading-relaxed text-parchment/58">
            Respect fellow engineers, claim what you build, keep contraptions lag-friendly, and
            leave grief, cheats, and toxicity outside the chronicle. Admins have the final word
            when the story needs it.
          </p>
        </section>

        <p className="font-body text-xs text-parchment/35">
          © {new Date().getFullYear()} {SITE.name}. Not affiliated with Mojang or Microsoft.
        </p>
      </div>
    </footer>
  );
}
