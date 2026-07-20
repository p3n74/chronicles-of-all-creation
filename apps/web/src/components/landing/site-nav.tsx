import { Link } from "@tanstack/react-router";

import { SITE } from "@/lib/constants";

const anchorItems = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Download", href: "/#download" },
] as const;

export function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="font-display text-xs tracking-[0.28em] text-parchment/90 uppercase transition hover:text-gold"
        >
          {SITE.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-6">
            {anchorItems.map((item) => (
              <li key={item.href} className="hidden sm:block">
                <a
                  href={item.href}
                  className="font-display text-[0.65rem] tracking-[0.22em] text-parchment/65 uppercase transition hover:text-gold sm:text-xs"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/quests"
                className="font-display text-[0.65rem] tracking-[0.22em] text-gold/90 uppercase transition hover:text-gold-bright sm:text-xs"
                activeProps={{ className: "text-gold-bright" }}
              >
                Questlines
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
