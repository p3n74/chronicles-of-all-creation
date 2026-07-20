import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { SITE } from "@/lib/constants";

const anchorItems = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Questlines", to: "/quests" as const },
  { label: "Download", href: "/#download" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-gold/50 focus:bg-ink focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:tracking-[0.18em] focus:text-gold focus:uppercase"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || open
            ? "border-b border-gold/15 bg-ink/88 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            to="/"
            className="min-w-0 truncate font-display text-[0.7rem] tracking-[0.22em] text-parchment/90 uppercase transition duration-300 hover:text-gold sm:text-xs"
            onClick={() => setOpen(false)}
          >
            {SITE.name}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {anchorItems.map((item) => (
                <li key={item.label}>
                  {"to" in item ? (
                    <Link
                      to={item.to}
                      className="font-display text-[0.65rem] tracking-[0.2em] text-parchment/65 uppercase transition duration-300 hover:text-gold"
                      activeProps={{ className: "text-gold" }}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="font-display text-[0.65rem] tracking-[0.2em] text-parchment/65 uppercase transition duration-300 hover:text-gold"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border border-gold/25 text-parchment/80 transition duration-300 hover:border-gold/50 hover:text-gold md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>

        {open ? (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="border-t border-gold/15 bg-ink/95 px-6 py-6 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {anchorItems.map((item, i) => (
                <li
                  key={item.label}
                  className="animate-fade-rise border-b border-gold/10"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {"to" in item ? (
                    <Link
                      to={item.to}
                      className="block py-3.5 font-display text-sm tracking-[0.18em] text-parchment/85 uppercase transition hover:text-gold"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="block py-3.5 font-display text-sm tracking-[0.18em] text-parchment/85 uppercase transition hover:text-gold"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
