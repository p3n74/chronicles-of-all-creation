import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { SiteNav } from "@/components/landing/site-nav";
import { Footer } from "@/components/landing/footer";
import {
  QUEST_GROUPS_DATA,
  TOTAL_CHAPTERS,
  TOTAL_QUESTS,
  type QuestChapter,
  type QuestNode,
  type QuestStatus,
} from "@/lib/quests-data";

export const Route = createFileRoute("/quests")({
  component: QuestsPage,
});

/** Pixel size of an FTB-style square quest button (base; scaled by quest.size). */
const TILE = 40;
/** Gap between grid units in pixels (FTB quest_spacing feel). */
const CELL = 72;
const PAD = 64;
const VIEW_H = 520;

const STATUS_OUTLINE: Record<QuestStatus, string> = {
  completed: "rgba(86, 255, 86, 0.78)",
  started: "rgba(0, 255, 255, 0.78)",
  available: "rgba(255, 255, 255, 0.58)",
  locked: "rgba(153, 153, 153, 0.85)",
};

const STATUS_FACE: Record<QuestStatus, string> = {
  completed: "rgba(86, 255, 86, 0.12)",
  started: "rgba(0, 255, 255, 0.10)",
  available: "rgba(255, 255, 255, 0.06)",
  locked: "rgba(0, 0, 0, 0.45)",
};

type GraphNode = {
  quest: QuestNode;
  x: number;
  y: number;
  cx: number;
  cy: number;
  tile: number;
};

type GraphEdge = {
  from: GraphNode;
  to: GraphNode;
  complete: boolean;
  unavailable: boolean;
};

function firstChapterId(): string {
  for (const group of QUEST_GROUPS_DATA) {
    if (group.chapters[0]) return group.chapters[0].id;
  }
  return "";
}

function QuestsPage() {
  const [activeChapterId, setActiveChapterId] = useState(firstChapterId);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;
  const q = query.trim().toLowerCase();

  const activeMeta = useMemo(() => {
    for (const group of QUEST_GROUPS_DATA) {
      const chapter = group.chapters.find((c) => c.id === activeChapterId);
      if (chapter) return { group, chapter };
    }
    const group = QUEST_GROUPS_DATA[0];
    return { group, chapter: group?.chapters[0] ?? null };
  }, [activeChapterId]);

  const searchHits = useMemo(() => {
    if (!searching) return [];
    const hits: {
      groupTitle: string;
      chapter: QuestChapter;
      quest: QuestNode | null;
    }[] = [];
    for (const group of QUEST_GROUPS_DATA) {
      for (const chapter of group.chapters) {
        const chapterMatch =
          chapter.title.toLowerCase().includes(q) ||
          chapter.subtitle.toLowerCase().includes(q) ||
          group.title.toLowerCase().includes(q);
        if (chapterMatch) {
          hits.push({ groupTitle: group.title, chapter, quest: null });
        }
        for (const quest of chapter.quests) {
          if (
            quest.title.toLowerCase().includes(q) ||
            quest.subtitle.toLowerCase().includes(q) ||
            quest.description.toLowerCase().includes(q)
          ) {
            hits.push({ groupTitle: group.title, chapter, quest });
          }
        }
      }
    }
    return hits.slice(0, 80);
  }, [q, searching]);

  return (
    <div className="min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-ink text-parchment">
      <div id="nav-sentinel" className="pointer-events-none absolute top-0 h-px w-full" aria-hidden />
      <SiteNav />

      <main id="main">
      <header className="border-b border-gold/15 bg-ink-soft">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 pt-24 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl tracking-tight text-parchment sm:text-3xl">
              Questlines
            </h1>
            <p className="mt-2 font-body text-sm text-parchment/55">
              <span className="tabular-nums text-parchment/70">{TOTAL_CHAPTERS}</span> chapters
              <span className="mx-2 text-gold/35" aria-hidden>
                /
              </span>
              <span className="tabular-nums text-parchment/70">{TOTAL_QUESTS}</span> quests
            </p>
          </div>
          <label className="flex w-full max-w-sm items-center gap-2 border border-gold/25 bg-ink px-3 py-2.5 transition duration-300 focus-within:border-gold/55">
            <Search className="size-3.5 shrink-0 text-parchment/40" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chapters and quests"
              className="w-full bg-transparent font-body text-sm text-parchment placeholder:text-parchment/35 focus:outline-none"
              aria-label="Search chapters and quests"
            />
          </label>
        </div>
      </header>

      {searching ? (
        <section className="mx-auto max-w-6xl px-6 py-8">
          {searchHits.length === 0 ? (
            <p className="font-body text-sm text-parchment/50">No matches.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {searchHits.map((hit) => {
                const key = hit.quest
                  ? `${hit.chapter.id}-${hit.quest.id}`
                  : `ch-${hit.chapter.id}`;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterId(hit.chapter.id);
                        setQuery("");
                      }}
                      className="w-full border border-gold/15 bg-ink-soft px-3 py-2 text-left transition hover:border-gold/40"
                    >
                      <span className="font-display text-[0.65rem] tracking-[0.14em] text-gold/70 uppercase">
                        {hit.groupTitle} · {hit.chapter.title}
                      </span>
                      <span className="mt-0.5 block font-body text-sm text-parchment">
                        {hit.quest ? hit.quest.title : hit.chapter.title}
                      </span>
                      {(hit.quest?.subtitle || (!hit.quest && hit.chapter.subtitle)) && (
                        <span className="mt-0.5 block font-body text-xs text-parchment/45">
                          {hit.quest?.subtitle || hit.chapter.subtitle}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[240px_1fr]">
          <nav
            aria-label="Quest chapters"
            className="max-h-[70vh] overflow-y-auto lg:sticky lg:top-24 lg:self-start"
          >
            <ul className="flex flex-col gap-4">
              {QUEST_GROUPS_DATA.map((group) => (
                <li key={group.id}>
                  <p className="mb-1.5 font-display text-[0.65rem] tracking-[0.18em] text-gold/80 uppercase">
                    {group.title}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {group.chapters.map((chapter) => {
                      const active = chapter.id === activeChapterId;
                      return (
                        <li key={chapter.id}>
                          <button
                            type="button"
                            onClick={() => setActiveChapterId(chapter.id)}
                            className={`flex w-full items-center gap-2 border px-2.5 py-1.5 text-left transition ${
                              active
                                ? "border-gold/60 bg-gold/10 text-gold"
                                : "border-gold/15 bg-ink-soft text-parchment/60 hover:border-gold/35 hover:text-parchment"
                            }`}
                          >
                            <ChapterIconThumb chapter={chapter} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-display text-[0.7rem] tracking-[0.06em] uppercase">
                                {chapter.title}
                              </span>
                              <span className="block font-body text-[0.6rem] normal-case tracking-normal text-parchment/35">
                                {chapter.questCount} quests
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            {activeMeta.chapter ? (
              <>
                <div className="mb-4 border-b border-gold/15 pb-3">
                  <p className="font-body text-xs text-parchment/45">
                    {activeMeta.group.title}
                  </p>
                  <h2 className="mt-1 font-display text-lg text-parchment">
                    {activeMeta.chapter.title}
                  </h2>
                  {activeMeta.chapter.subtitle ? (
                    <p className="mt-0.5 font-body text-sm text-parchment/55">
                      {activeMeta.chapter.subtitle}
                    </p>
                  ) : activeMeta.group.blurb ? (
                    <p className="mt-0.5 font-body text-sm text-parchment/55">
                      {activeMeta.group.blurb}
                    </p>
                  ) : null}
                </div>
                <QuestGraph chapter={activeMeta.chapter} />
              </>
            ) : (
              <p className="font-body text-sm text-parchment/50">No chapters loaded.</p>
            )}
          </div>
        </section>
      )}

      <Footer />
      </main>
    </div>
  );
}

function ChapterIconThumb({ chapter }: { chapter: QuestChapter }) {
  return (
    <span
      className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden"
      style={{
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
        background: "#2a2c30",
        imageRendering: "pixelated",
      }}
    >
      {chapter.iconUrl ? (
        <img
          src={chapter.iconUrl}
          alt=""
          className="size-5 object-contain"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
      ) : (
        <span className="font-sans text-[0.6rem] font-bold text-white/80">{chapter.iconLabel}</span>
      )}
    </span>
  );
}

function layoutQuests(quests: QuestNode[]): {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
} {
  if (quests.length === 0) {
    return { nodes: [], edges: [], width: CELL * 4, height: CELL * 3 };
  }

  const byId = new Map(quests.map((c) => [c.id, c]));
  const minX = Math.min(...quests.map((c) => c.x));
  const minY = Math.min(...quests.map((c) => c.y));
  const maxX = Math.max(...quests.map((c) => c.x));
  const maxY = Math.max(...quests.map((c) => c.y));

  const nodes: GraphNode[] = quests.map((quest) => {
    const tile = Math.round(TILE * Math.max(0.75, quest.size || 1));
    const x = PAD + (quest.x - minX) * CELL;
    const y = PAD + (quest.y - minY) * CELL;
    return {
      quest,
      x,
      y,
      cx: x + tile / 2,
      cy: y + tile / 2,
      tile,
    };
  });

  const nodeById = new Map(nodes.map((n) => [n.quest.id, n]));
  const edges: GraphEdge[] = [];

  for (const node of nodes) {
    for (const depId of node.quest.dependencies) {
      const from = nodeById.get(depId);
      if (!from || !byId.has(depId)) continue;
      edges.push({
        from,
        to: node,
        complete: from.quest.status === "completed",
        unavailable: node.quest.status === "locked",
      });
    }
  }

  // Account for oversized tiles at the edges
  const maxTile = Math.max(...nodes.map((n) => n.tile));
  const width = PAD * 2 + (maxX - minX) * CELL + maxTile;
  const height = PAD * 2 + (maxY - minY) * CELL + maxTile;

  return {
    nodes,
    edges,
    width: Math.max(width, CELL * 4),
    height: Math.max(height, CELL * 3),
  };
}

function edgeStroke(edge: GraphEdge, highlighted: "requires" | "required-for" | null): string {
  if (highlighted === "requires") return "#00C8C8";
  if (highlighted === "required-for") return "#C8C800";
  if (edge.complete) return "#64DC64";
  if (edge.unavailable) return "rgba(204, 163, 163, 0.4)";
  return "rgba(204, 163, 163, 0.7)";
}

function QuestGraph({ chapter }: { chapter: QuestChapter }) {
  const { nodes, edges, width, height } = useMemo(
    () => layoutQuests(chapter.quests),
    [chapter.quests],
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    quest: QuestNode;
    left: number;
    top: number;
  } | null>(null);

  const centerPan = useEffectEvent(() => {
    const el = viewportRef.current;
    if (!el) return;
    const vw = el.clientWidth;
    const vh = el.clientHeight;
    setPan({
      x: Math.round((vw - width) / 2),
      y: Math.round((vh - height) / 2),
    });
  });

  useEffect(() => {
    centerPan();
  }, [chapter.id, width, height]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => centerPan());
    ro.observe(el);
    return () => ro.disconnect();
  }, [chapter.id]);

  if (nodes.length === 0) {
    return (
      <p className="font-body text-sm text-parchment/50">
        This chapter has no quests yet.
      </p>
    );
  }

  const hovered = hoveredId ? nodes.find((n) => n.quest.id === hoveredId) : null;

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("[data-quest-tile]")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragOrigin.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setPan({
      x: dragOrigin.current.panX + (e.clientX - dragOrigin.current.x),
      y: dragOrigin.current.panY + (e.clientY - dragOrigin.current.y),
    });
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        role="list"
        aria-label={`${chapter.title} quest graph`}
        className={`ftb-quest-canvas relative overflow-hidden border border-[#1B1D1E] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ height: VIEW_H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute top-0 left-0 will-change-transform"
          style={{
            width,
            height,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            width={width}
            height={height}
            aria-hidden
          >
            {edges.map((edge) => {
              const key = `${edge.from.quest.id}->${edge.to.quest.id}`;
              let highlight: "requires" | "required-for" | null = null;
              if (hovered) {
                if (edge.to.quest.id === hovered.quest.id) highlight = "requires";
                else if (edge.from.quest.id === hovered.quest.id) highlight = "required-for";
              }
              const stroke = edgeStroke(edge, highlight);
              const active = highlight !== null;
              return (
                <line
                  key={key}
                  x1={edge.from.cx}
                  y1={edge.from.cy}
                  x2={edge.to.cx}
                  y2={edge.to.cy}
                  stroke={stroke}
                  strokeWidth={active ? 3.5 : 2.5}
                  strokeLinecap="butt"
                  strokeDasharray={active ? "8 5" : "10 6"}
                  className={active ? "ftb-dep-line-active" : "ftb-dep-line"}
                  opacity={active ? 1 : 0.9}
                />
              );
            })}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.quest.id}
              role="listitem"
              className="absolute"
              style={{ left: node.x, top: node.y, width: node.tile, height: node.tile }}
              onPointerEnter={(e) => {
                setHoveredId(node.quest.id);
                const rect = viewportRef.current?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({
                  quest: node.quest,
                  left: e.clientX - rect.left + 14,
                  top: e.clientY - rect.top + 14,
                });
              }}
              onPointerMove={(e) => {
                const rect = viewportRef.current?.getBoundingClientRect();
                if (!rect) return;
                setTooltip({
                  quest: node.quest,
                  left: e.clientX - rect.left + 14,
                  top: e.clientY - rect.top + 14,
                });
              }}
              onPointerLeave={() => {
                setHoveredId(null);
                setTooltip(null);
              }}
            >
              <QuestTile quest={node.quest} highlighted={hoveredId === node.quest.id} />
            </div>
          ))}
        </div>

        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 max-w-[18rem] border border-[#1B1D1E] bg-[#1a1c1f]/95 px-2.5 py-2 shadow-lg"
            style={{
              left: Math.min(tooltip.left, (viewportRef.current?.clientWidth ?? 320) - 220),
              top: Math.min(tooltip.top, (viewportRef.current?.clientHeight ?? 200) - 100),
            }}
          >
            <p className="font-sans text-[0.8rem] leading-tight font-semibold text-[#FFFFA0]">
              {tooltip.quest.title}
            </p>
            {tooltip.quest.subtitle && (
              <p className="mt-1 font-sans text-[0.72rem] leading-snug text-white/90">
                {tooltip.quest.subtitle}
              </p>
            )}
            {tooltip.quest.description && (
              <p className="mt-1.5 line-clamp-6 font-sans text-[0.68rem] leading-snug whitespace-pre-line text-white/55">
                {tooltip.quest.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestTile({
  quest,
  highlighted,
}: {
  quest: QuestNode;
  highlighted: boolean;
}) {
  const outline = STATUS_OUTLINE[quest.status];
  const face = STATUS_FACE[quest.status];
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = Boolean(quest.iconUrl) && !imgFailed;

  return (
    <button
      type="button"
      data-quest-tile
      aria-label={`${quest.title}${quest.subtitle ? `. ${quest.subtitle}` : ""}`}
      className="group relative flex size-full items-center justify-center focus-visible:outline-none"
      style={{
        boxShadow: highlighted
          ? `inset 0 0 0 2px ${outline}, 0 0 0 1px rgba(0,0,0,0.8)`
          : `inset 0 0 0 2px ${outline}, 0 1px 0 rgba(255,255,255,0.06)`,
        background: `
          linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 42%),
          linear-gradient(0deg, ${face}, ${face}),
          #2a2c30
        `,
        imageRendering: "pixelated",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px]"
        style={{
          boxShadow:
            "inset 1px 1px 0 rgba(255,255,255,0.12), inset -1px -1px 0 rgba(0,0,0,0.55)",
          background:
            quest.status === "locked"
              ? "repeating-linear-gradient(135deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 4px)"
              : "transparent",
        }}
      />
      {showImg ? (
        <img
          src={quest.iconUrl!}
          alt=""
          className="relative size-[70%] object-contain"
          style={{
            imageRendering: "pixelated",
            opacity: quest.status === "locked" ? 0.35 : 1,
          }}
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span
          className={`relative font-sans text-[0.75rem] font-bold tracking-wide ${
            quest.status === "locked" ? "text-white/35" : "text-white/90"
          }`}
        >
          {quest.iconLabel}
        </span>
      )}
      {quest.status === "completed" && (
        <span
          aria-hidden
          className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-[1px] bg-[#56FF56]"
          style={{ boxShadow: "0 0 0 1px #1B1D1E" }}
        />
      )}
    </button>
  );
}
