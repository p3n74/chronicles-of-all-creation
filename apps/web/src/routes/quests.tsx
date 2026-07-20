import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { SiteNav } from "@/components/landing/site-nav";
import { Footer } from "@/components/landing/footer";
import {
  QUEST_GROUPS_DATA,
  TOTAL_CHAPTERS,
  TOTAL_QUESTS,
  type QuestGroup,
} from "@/lib/quests-data";

export const Route = createFileRoute("/quests")({
  component: QuestsPage,
});

function QuestsPage() {
  const [activeGroupId, setActiveGroupId] = useState(QUEST_GROUPS_DATA[0].id);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;

  const filteredGroups = useMemo(() => {
    if (!searching) return QUEST_GROUPS_DATA;
    const q = query.trim().toLowerCase();
    return QUEST_GROUPS_DATA.map((group) => ({
      ...group,
      chapters: group.chapters.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          group.title.toLowerCase().includes(q),
      ),
    })).filter((group) => group.chapters.length > 0);
  }, [query, searching]);

  const activeGroup = QUEST_GROUPS_DATA.find((g) => g.id === activeGroupId) ?? QUEST_GROUPS_DATA[0];

  return (
    <main className="min-h-svh bg-ink text-parchment">
      <SiteNav />

      <section className="relative border-b border-gold/15 bg-ink-soft">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(125,149,181,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-28 text-center">
          <p className="mb-4 font-display text-xs tracking-[0.35em] text-gold uppercase">
            The Questbook
          </p>
          <h1 className="mb-4 font-display text-3xl text-parchment sm:text-5xl">
            Chronicle of Questlines
          </h1>
          <p className="mx-auto max-w-2xl font-body text-base leading-relaxed text-parchment/70">
            Every chapter below exists in-game, hand-written for this pack — {TOTAL_CHAPTERS}{" "}
            chapters and {TOTAL_QUESTS}+ quests carrying you from your first cogwheel to an
            orbital dockyard.
          </p>

          <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-sm border border-gold/25 bg-ink px-4 py-2.5 focus-within:border-gold/60">
            <Search className="size-4 shrink-0 text-parchment/40" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chapters — trains, rockets, enchanting…"
              className="w-full bg-transparent font-body text-sm text-parchment placeholder:text-parchment/35 focus:outline-none"
              aria-label="Search quest chapters"
            />
          </div>
        </div>
      </section>

      {searching ? (
        <section className="mx-auto max-w-4xl px-6 py-12">
          {filteredGroups.length === 0 ? (
            <p className="text-center font-body text-parchment/55">
              No chapters match "{query}". The Guide suggests fewer letters.
            </p>
          ) : (
            <div className="flex flex-col gap-10">
              {filteredGroups.map((group) => (
                <div key={group.id}>
                  <h2 className="mb-4 font-display text-sm tracking-[0.25em] text-gold uppercase">
                    {group.title}
                  </h2>
                  <ChapterList group={group} />
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[260px_1fr]">
          <nav aria-label="Quest groups" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {QUEST_GROUPS_DATA.map((group) => {
                const active = group.id === activeGroupId;
                return (
                  <li key={group.id}>
                    <button
                      type="button"
                      onClick={() => setActiveGroupId(group.id)}
                      className={`w-full rounded-sm border px-4 py-2.5 text-left font-display text-xs tracking-[0.12em] uppercase transition ${
                        active
                          ? "border-gold/60 bg-gold/10 text-gold"
                          : "border-gold/15 bg-ink-soft text-parchment/60 hover:border-gold/40 hover:text-parchment"
                      }`}
                    >
                      {group.title}
                      <span className="ml-2 font-body text-[0.65rem] normal-case tracking-normal text-parchment/40">
                        {group.chapters.length} ch.
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <div className="mb-6 flex items-start gap-3 border-b border-gold/15 pb-6">
              <BookOpen className="mt-1 size-5 shrink-0 text-gold" aria-hidden />
              <div>
                <h2 className="font-display text-xl text-parchment">{activeGroup.title}</h2>
                <p className="mt-1 font-body text-sm text-parchment/60">{activeGroup.blurb}</p>
              </div>
            </div>
            <ChapterList group={activeGroup} />
          </div>
        </section>
      )}

      <div className="border-t border-gold/15 bg-ink-soft py-12 text-center">
        <p className="mb-4 font-body text-sm text-parchment/60">
          The full questbook awaits in-game.
        </p>
        <Link
          to="/"
          className="font-display text-xs tracking-[0.22em] text-gold uppercase transition hover:text-gold-bright"
        >
          Back to the landing page
        </Link>
      </div>

      <Footer />
    </main>
  );
}

function ChapterList({ group }: { group: QuestGroup }) {
  const [openChapter, setOpenChapter] = useState<string | null>(null);

  return (
    <ul className="flex flex-col gap-3">
      {group.chapters.map((chapter) => {
        const open = openChapter === chapter.title;
        return (
          <li key={chapter.title}>
            <button
              type="button"
              onClick={() => setOpenChapter(open ? null : chapter.title)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 rounded-sm border border-gold/15 bg-ink-soft px-5 py-4 text-left transition hover:border-gold/40"
            >
              <span className="font-display text-sm tracking-wide text-parchment">
                {chapter.title}
              </span>
              <span className="flex items-center gap-3">
                {chapter.quests > 0 && (
                  <span className="rounded-sm border border-gold/20 px-2 py-0.5 font-body text-[0.65rem] text-gold">
                    {chapter.quests} quests
                  </span>
                )}
                <ChevronDown
                  className={`size-4 text-parchment/40 transition-transform ${open ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </span>
            </button>
            {open && (
              <p className="border-x border-b border-gold/15 bg-ink px-5 py-4 font-body text-sm leading-relaxed text-parchment/70">
                {chapter.subtitle}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
