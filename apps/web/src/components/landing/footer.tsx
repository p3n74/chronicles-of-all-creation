import { Download } from "lucide-react";

import { ALT_SERVER_IP, DOWNLOAD_URL, SERVER_IP, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer id="download" className="scroll-mt-20 border-t border-gold/20 bg-ink-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 text-center">
        <div>
          <p className="font-display text-lg tracking-wide text-parchment">{SITE.name}</p>
          <p className="mt-2 font-body text-sm text-parchment/55">
            Join at <span className="text-gold">{SERVER_IP}</span>
          </p>
          <p className="mt-1 font-body text-xs text-parchment/40">
            Direct connect: <span className="text-parchment/60">{ALT_SERVER_IP}</span>
          </p>
        </div>

        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-sm border border-gold/40 bg-gold/10 px-6 py-3.5 font-display text-xs font-semibold tracking-[0.2em] text-gold uppercase transition hover:bg-gold hover:text-ink"
        >
          <Download className="size-4" aria-hidden />
          Download the Modpack
        </a>
        <p className="-mt-6 font-body text-xs text-parchment/45">
          Hosted on Google Drive — grab the latest version, drop it in your launcher, and set sail.
        </p>

        <section id="rules" className="max-w-2xl scroll-mt-20 border-t border-gold/10 pt-8">
          <h2 className="mb-3 font-display text-sm tracking-[0.2em] text-gold uppercase">
            Server Rules
          </h2>
          <p className="font-body text-sm leading-relaxed text-parchment/60">
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
