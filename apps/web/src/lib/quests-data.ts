/**
 * Quest book data exported from FTB Quests SNBT (`quests/`).
 * Regenerate with: `node scripts/export-ftb-quests.mjs`
 */
import generated from "./generated/quests.json";

export type QuestStatus = "completed" | "started" | "available" | "locked";

export interface QuestNode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** FTB quest grid X (from SNBT). */
  x: number;
  /** FTB quest grid Y (from SNBT). */
  y: number;
  size: number;
  shape: string | null;
  dependencies: string[];
  iconItemId: string | null;
  iconUrl: string | null;
  iconLabel: string;
  status: QuestStatus;
}

export interface QuestChapter {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  orderIndex: number;
  iconItemId: string | null;
  iconUrl: string | null;
  iconLabel: string;
  questCount: number;
  quests: QuestNode[];
}

export interface QuestGroup {
  id: string;
  title: string;
  blurb: string;
  chapters: QuestChapter[];
}

export const QUEST_GROUPS_DATA = generated.groups as QuestGroup[];

export const TOTAL_QUESTS = generated.totalQuests as number;
export const TOTAL_CHAPTERS = generated.totalChapters as number;

export function findChapter(
  chapterId: string,
): { group: QuestGroup; chapter: QuestChapter } | null {
  for (const group of QUEST_GROUPS_DATA) {
    const chapter = group.chapters.find((c) => c.id === chapterId);
    if (chapter) return { group, chapter };
  }
  return null;
}
