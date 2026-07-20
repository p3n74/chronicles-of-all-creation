#!/usr/bin/env node
/**
 * Parse FTB Quests SNBT from /quests and emit typed data for apps/web.
 *
 * Usage: node scripts/export-ftb-quests.mjs [--skip-icons]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QUESTS_DIR = path.join(ROOT, "quests");
const LOCAL_ICONS_DIR = path.join(ROOT, "icons");
const OUT_JSON = path.join(ROOT, "apps/web/src/lib/generated/quests.json");
const OUT_ICONS = path.join(ROOT, "apps/web/public/quest-icons");
const SKIP_ICONS = process.argv.includes("--skip-icons");

const FORMATTING_RE = /&(?:#[0-9A-Fa-f]{6}|[0-9A-Fa-fk-orK-OR])/g;

// Known GitHub / jsDelivr texture roots (modid → candidate bases).
// Paths are relative to assets/<modid>/textures/
const MOD_TEXTURE_BASES = {
  minecraft: [
    "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.1/assets/minecraft/textures",
  ],
  create: [
    "https://raw.githubusercontent.com/Creators-of-Create/Create/mc1.20.1/dev/src/main/resources/assets/create/textures",
    "https://cdn.jsdelivr.net/gh/Creators-of-Create/Create@mc1.20.1/dev/src/main/resources/assets/create/textures",
  ],
  createaddition: [
    "https://raw.githubusercontent.com/mrh0/createaddition/1.20.1/src/main/resources/assets/createaddition/textures",
  ],
  farmersdelight: [
    "https://cdn.jsdelivr.net/gh/vectorwing/FarmersDelight@1.20/src/main/resources/assets/farmersdelight/textures",
  ],
  createdieselgenerators: [
    "https://raw.githubusercontent.com/george8188625/Create-Diesel-Generators/1.20.1/src/main/resources/assets/createdieselgenerators/textures",
  ],
  create_connected: [
    "https://raw.githubusercontent.com/hlysine/create_connected/main/src/main/resources/assets/create_connected/textures",
  ],
  create_enchantment_industry: [
    "https://raw.githubusercontent.com/Wan-Hou/CreateEnchantmentIndustry-Fabric/1.20.1/0.5.1-dev/src/main/resources/assets/create_enchantment_industry/textures",
  ],
  immersive_aircraft: [
    "https://raw.githubusercontent.com/Luke100000/ImmersiveAircraft/1.20.1/common/src/main/resources/assets/immersive_aircraft/textures",
  ],
};

/** When the SNBT item has no flat texture (block entity / custom), map to a close stand-in. */
const ITEM_ALIASES = {
  "ftbquests:book": "minecraft:book",
  "ftbquests:custom_icon": "minecraft:book",
  "naturescompass:naturescompass": "minecraft:compass",
  "explorerscompass:explorerscompass": "minecraft:recovery_compass",
  "create:track_station": "create:track",
  "create:track_signal": "create:track",
  "create:track_observer": "create:track",
  "create:mechanical_crafter": "create:crafting_blueprint",
  "create:hand_crank": "create:wrench",
  "create:mechanical_mixer": "create:whisk",
  "create:water_wheel": "create:andesite_alloy",
  "create:large_water_wheel": "create:andesite_alloy",
  "create:encased_fan": "create:propeller",
  "create:steam_engine": "create:steam_whistle",
  "create:empty_blaze_burner": "minecraft:blaze_powder",
  "create:mechanical_drill": "minecraft:iron_pickaxe",
  "create:mechanical_saw": "minecraft:iron_axe",
  "create:crushing_wheel": "create:cogwheel",
  "pamhc2crops:tomatoitem": "farmersdelight:tomato",
  "mca:engagement_ring": "minecraft:gold_ingot",
  "exposure:camera": "minecraft:spyglass",
  "simplyswords:iron_longsword": "minecraft:iron_sword",
  "automobility:automobile_assembler": "minecraft:minecart",
  "create_jetpack:jetpack": "minecraft:elytra",
  "smallships:oak_cog": "minecraft:oak_boat",
  "jeg:gunsmith_manual": "minecraft:book",
  "create_new_age:generator_coil": "create:cogwheel",
  "create_connected:encased_chain_cogwheel": "create:encased_chain_drive",
  "create_optical:heavy_optical_receptor": "minecraft:spyglass",
  "create_blaze_burner_fuels:blaze_core": "minecraft:blaze_powder",
  "create_deep_dark:echo_ingot": "minecraft:echo_shard",
  "create_confectionery:gingerbread_man": "minecraft:cookie",
  "createoreexcavation:vein_finder": "minecraft:iron_pickaxe",
  "aeronautics:andesite_propeller": "create:propeller",
  "farmersrespite:kettle": "minecraft:flower_pot",
  "silentgear:pickaxe_blueprint": "minecraft:paper",
  "eternal_starlight:orb_of_prophecy": "minecraft:ender_eye",
  "rottencreatures:frozen_rotten_flesh": "minecraft:rotten_flesh",
  "mutantmonsters:hulk_hammer": "minecraft:iron_axe",
  "adorablehamsterpets:sunflower_seeds": "minecraft:wheat_seeds",
  "create_integrated_farming:chicken_roost": "minecraft:egg",
  "comforts:sleeping_bag_red": "minecraft:red_wool",
  "irons_spellbooks:inscription_table": "minecraft:enchanted_book",
  "create_enchantment_industry:blaze_enchanter": "minecraft:enchanted_book",
  "apotheosis:gem": "minecraft:diamond",
  "stellaris:steel_ingot": "minecraft:iron_ingot",
  "stellaris:antenna": "minecraft:redstone_torch",
  "stellaris:oxygen_distributor": "minecraft:glass_bottle",
  "stellaris:rocket": "minecraft:firework_rocket",
  "numismatics:spur": "minecraft:gold_nugget",
  "create_hypertube:hypertube": "minecraft:glass",
  "immersive_aircraft:biplane": "minecraft:firework_rocket",
  "createbigcannons:cannon_builder": "minecraft:tnt",
  "minecraft:red_bed": "minecraft:red_wool",
  "minecraft:player_head": "minecraft:skeleton_skull",
  "someassemblyrequired:sandwich": "minecraft:bread",
  "someassemblyrequired:bread_slice": "minecraft:bread",
  "someassemblyrequired:burger_bun_bottom": "minecraft:bread",
  // Just Enough Guns — not in extracted jars; conceptual stand-ins
  "jeg:gunsmith_manual": "minecraft:book",
  "jeg:crowbar": "minecraft:iron_pickaxe",
  "jeg:waterpipe_shotgun": "minecraft:crossbow",
  "jeg:revolver": "minecraft:crossbow",
  "jeg:pistol_ammo": "minecraft:iron_nugget",
  "jeg:handmade_shell": "minecraft:gunpowder",
  "jeg:combat_pistol": "minecraft:crossbow",
  "jeg:pistol_magazine": "minecraft:iron_ingot",
  "jeg:custom_smg": "minecraft:crossbow",
  "jeg:pump_shotgun": "minecraft:crossbow",
  "jeg:semi_auto_rifle": "minecraft:crossbow",
  "jeg:makeshift_stock": "minecraft:stick",
  "jeg:reflex_sight": "minecraft:spyglass",
  "jeg:light_grip": "minecraft:stick",
  "jeg:repair_kit": "minecraft:anvil",
  "jeg:flare_gun": "minecraft:firework_rocket",
  "jeg:bulletproof_vest_i": "minecraft:iron_chestplate",
  "jeg:assault_rifle": "minecraft:crossbow",
  "jeg:blossom_rifle": "minecraft:crossbow",
  "jeg:holy_shotgun": "minecraft:crossbow",
  "createfood:fishcake": "minecraft:cooked_cod",
};

const MC_TEX =
  "https://cdn.jsdelivr.net/gh/InventivetalentDev/minecraft-assets@1.20.1/assets/minecraft/textures";

/** Direct stable image URLs (verified) keyed by original item id. */
const DIRECT_ICON_URLS = {
  "ftbquests:book": `${MC_TEX}/item/book.png`,
  "minecraft:book": `${MC_TEX}/item/book.png`,
  "minecraft:crossbow": `${MC_TEX}/item/crossbow_standby.png`,
  "minecraft:red_bed": `${MC_TEX}/entity/bed/red.png`,
  "minecraft:cooked_cod": `${MC_TEX}/item/cooked_cod.png`,
  "createbigcannons:cannon_builder": `${MC_TEX}/block/dispenser_front.png`,
  "irons_spellbooks:inscription_table": `${MC_TEX}/block/enchanting_table_top.png`,
  "create_enchantment_industry:blaze_enchanter": `${MC_TEX}/block/enchanting_table_top.png`,
  "comforts:sleeping_bag_red": `${MC_TEX}/block/red_wool.png`,
  "apotheosis:gem": `${MC_TEX}/item/diamond.png`,
};

/* ---------------- SNBT parser ---------------- */

function parseSnbt(input) {
  const src = input.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let i = 0;

  function skipWs() {
    while (i < src.length) {
      const c = src[i];
      if (c === " " || c === "\t" || c === "\n") {
        i++;
        continue;
      }
      if (c === "/" && src[i + 1] === "/") {
        i += 2;
        while (i < src.length && src[i] !== "\n") i++;
        continue;
      }
      break;
    }
  }

  function parseString() {
    i++; // "
    let out = "";
    while (i < src.length) {
      const c = src[i++];
      if (c === '"') break;
      if (c === "\\") {
        const n = src[i++];
        if (n === "n") out += "\n";
        else if (n === "t") out += "\t";
        else if (n === "r") out += "\r";
        else if (n === '"' || n === "\\") out += n;
        else out += n;
      } else out += c;
    }
    return out;
  }

  function parseNumberOrBoolOrNull(raw) {
    if (raw === "true") return true;
    if (raw === "false") return false;
    if (raw === "null") return null;
    const m = raw.match(/^([+-]?(?:\d+\.?\d*|\.\d+))([dfDBL]?)$/i);
    if (m) return Number(m[1]);
    return raw;
  }

  function parseValue() {
    skipWs();
    const c = src[i];
    if (c === "{") return parseObject();
    if (c === "[") return parseArray();
    if (c === '"') return parseString();

    let start = i;
    while (i < src.length && !/[\s{}\[\],:]/.test(src[i])) i++;
    const raw = src.slice(start, i);
    return parseNumberOrBoolOrNull(raw);
  }

  function parseKey() {
    skipWs();
    if (src[i] === '"') return parseString();
    let start = i;
    while (i < src.length && /[A-Za-z0-9_./+-]/.test(src[i])) i++;
    return src.slice(start, i);
  }

  function parseObject() {
    i++; // {
    const obj = {};
    skipWs();
    while (i < src.length && src[i] !== "}") {
      const key = parseKey();
      skipWs();
      if (src[i] === ":") i++;
      const value = parseValue();
      obj[key] = value;
      skipWs();
      if (src[i] === ",") i++;
      skipWs();
    }
    if (src[i] === "}") i++;
    return obj;
  }

  function parseArray() {
    i++; // [
    const arr = [];
    skipWs();
    while (i < src.length && src[i] !== "]") {
      arr.push(parseValue());
      skipWs();
      if (src[i] === ",") i++;
      skipWs();
    }
    if (src[i] === "]") i++;
    return arr;
  }

  skipWs();
  const value = parseValue();
  return value;
}

/* ---------------- helpers ---------------- */

function stripFormatting(s) {
  return String(s ?? "")
    .replace(FORMATTING_RE, "")
    .replace(/\\&/g, "&")
    .replace(/\\n/g, "\n")
    .trim();
}

function iconLabelFrom(title, itemId) {
  const clean = stripFormatting(title).replace(/[^A-Za-z0-9 ]/g, " ").trim();
  if (clean) {
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (itemId) {
    const name = itemId.split(":")[1] ?? itemId;
    return name
      .split("_")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);
  }
  return "?";
}

function extractIconItemId(icon, tasks, rewards) {
  // 1) Explicit SNBT icon item (what FTB shows on the node)
  if (icon && typeof icon === "object") {
    if (icon.id && icon.id !== "ftbquests:custom_icon") return icon.id;
  }
  // 2) First item task (FTB default when no icon set)
  if (Array.isArray(tasks)) {
    for (const task of tasks) {
      if (task?.type === "item" && task.item) {
        if (typeof task.item === "string") return task.item;
        if (typeof task.item === "object" && task.item.id) return task.item.id;
      }
    }
  }
  // 3) First item reward (checkmark quests often still reward an item)
  if (Array.isArray(rewards)) {
    for (const reward of rewards) {
      if (reward?.type === "item" && reward.item) {
        if (typeof reward.item === "string") return reward.item;
        if (typeof reward.item === "object" && reward.item.id) return reward.item.id;
      }
    }
  }
  return null;
}

/** Conceptual stand-ins for checkmark / NO_ITEM quests (title keywords). */
function conceptualIconFromTitle(title) {
  const t = stripFormatting(title).toLowerCase();
  if (!t) return null;
  const rules = [
    [/sleep|nap|bed|hammock|rest/, "minecraft:red_bed"],
    [/team|friend|party|invite/, "minecraft:player_head"],
    [/book|guide|manual|read|lore|codex/, "minecraft:book"],
    [/map|compass|explore|cartograph/, "minecraft:map"],
    [/home|camp|claim|house/, "minecraft:oak_door"],
    [/path|choice|fork|branch/, "minecraft:compass"],
    [/welcome|hello|intro|session/, "minecraft:writable_book"],
    [/jei|recipe|craft guide/, "minecraft:crafting_table"],
    [/control|keybind|hotkey/, "minecraft:lever"],
    [/inventory|pocket/, "minecraft:chest"],
    [/train|rail|track/, "minecraft:rail"],
    [/stress|stressometer|speedometer/, "create:stressometer"],
    [/gun|rifle|pistol|shotgun/, "minecraft:crossbow"],
    [/check|complete|emeritus|graduate|closed/, "minecraft:lime_dye"],
  ];
  for (const [re, id] of rules) {
    if (re.test(t)) return id;
  }
  return null;
}

/**
 * Index the local icons pack produced from mod jars:
 *   icons/unique_items/<mod>__<item>.png
 *   icons/by_chapter/<chapter>/NN_<questId|slug>__<mod>__<item>.png
 *   icons/manifest.tsv
 */
async function loadLocalIconIndex() {
  const byItem = new Map();
  const byQuestId = new Map();
  const uniqueDir = path.join(LOCAL_ICONS_DIR, "unique_items");
  const byChapterDir = path.join(LOCAL_ICONS_DIR, "by_chapter");

  if (await pathExists(uniqueDir)) {
    for (const name of await fs.readdir(uniqueDir)) {
      if (!name.endsWith(".png")) continue;
      const stem = name.slice(0, -4);
      const idx = stem.indexOf("__");
      if (idx === -1) continue;
      const itemId = `${stem.slice(0, idx)}:${stem.slice(idx + 2)}`;
      byItem.set(itemId, path.join(uniqueDir, name));
    }
  }

  if (await pathExists(byChapterDir)) {
    const chapters = await fs.readdir(byChapterDir);
    for (const chapter of chapters) {
      const dir = path.join(byChapterDir, chapter);
      const st = await fs.stat(dir).catch(() => null);
      if (!st?.isDirectory()) continue;
      for (const name of await fs.readdir(dir)) {
        if (!name.endsWith(".png")) continue;
        // NN_<idOrSlug>__mod__item.png
        const m = name.match(/^\d+_(.+?)__([a-z0-9_]+)__([a-z0-9_]+)\.png$/i);
        if (!m) continue;
        const [, slug, mod, item] = m;
        const abs = path.join(dir, name);
        if (/^[0-9a-f]{16}$/i.test(slug)) {
          byQuestId.set(slug.toUpperCase(), abs);
        }
        const itemId = `${mod}:${item}`;
        if (!byItem.has(itemId)) byItem.set(itemId, abs);
      }
    }
  }

  return { byItem, byQuestId };
}

async function copyLocalIcon(absPath, itemId) {
  const safe = itemId.replace(":", "__").replace(/[^a-zA-Z0-9_.-]/g, "_");
  const localRel = `/quest-icons/${safe}.png`;
  const localAbs = path.join(OUT_ICONS, `${safe}.png`);
  await fs.mkdir(OUT_ICONS, { recursive: true });
  await fs.copyFile(absPath, localAbs);
  return localRel;
}

function extractCustomIconPath(icon) {
  if (!icon || typeof icon !== "object") return null;
  const components = icon.components;
  if (components && typeof components === "object") {
    const custom = components["ftbquests:icon"];
    if (typeof custom === "string") return custom;
  }
  return null;
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchOk(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok) return true;
    // some CDNs reject HEAD
    if (res.status === 403 || res.status === 405) {
      const get = await fetch(url, { method: "GET", redirect: "follow" });
      return get.ok;
    }
    return false;
  } catch {
    return false;
  }
}

function candidateTextureUrls(itemId) {
  const [mod, name] = itemId.split(":");
  if (!mod || !name) return [];
  const bases = MOD_TEXTURE_BASES[mod] ?? [];
  const names = [name];
  // animated / special vanilla names
  if (mod === "minecraft") {
    if (name === "compass") names.push("compass_00");
    if (name === "clock") names.push("clock_00");
    if (name === "recovery_compass") names.push("recovery_compass_00");
    if (name === "crossbow") names.push("crossbow_standby", "crossbow_arrow");
    if (name === "bow") names.push("bow");
    if (name.endsWith("_bed")) names.push(name.replace(/_bed$/, ""), "red_wool");
  }
  const suffixes = ["", "_top", "_side", "_front", "_bottom", "_end", "_particle"];
  const urls = [];
  for (const base of bases) {
    for (const n of names) {
      urls.push(`${base}/item/${n}.png`);
      for (const suf of suffixes) {
        urls.push(`${base}/block/${n}${suf}.png`);
      }
    }
  }
  return urls;
}

async function downloadTo(localAbs, url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  // Accept only real PNGs (16×16 item textures can be <200 bytes)
  if (buf.length < 40 || buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) {
    return false;
  }
  await fs.writeFile(localAbs, buf);
  return true;
}

async function resolveAndCacheIcon(itemId, cache) {
  if (!itemId) return null;
  if (cache.has(itemId)) return cache.get(itemId);

  const safe = itemId.replace(":", "__").replace(/[^a-zA-Z0-9_.-]/g, "_");
  const localRel = `/quest-icons/${safe}.png`;
  const localAbs = path.join(OUT_ICONS, `${safe}.png`);

  if (await pathExists(localAbs)) {
    const existing = await fs.readFile(localAbs);
    if (
      existing.length >= 40 &&
      existing[0] === 0x89 &&
      existing[1] === 0x50 &&
      existing[2] === 0x4e &&
      existing[3] === 0x47
    ) {
      cache.set(itemId, localRel);
      return localRel;
    }
    await fs.unlink(localAbs);
  }

  const tryIds = [itemId];
  if (ITEM_ALIASES[itemId]) tryIds.push(ITEM_ALIASES[itemId]);

  // Direct URL for original id
  if (DIRECT_ICON_URLS[itemId]) {
    try {
      if (await downloadTo(localAbs, DIRECT_ICON_URLS[itemId])) {
        cache.set(itemId, localRel);
        return localRel;
      }
    } catch {
      /* fall through */
    }
  }

  for (const id of tryIds) {
    if (DIRECT_ICON_URLS[id] && id !== itemId) {
      try {
        if (await downloadTo(localAbs, DIRECT_ICON_URLS[id])) {
          cache.set(itemId, localRel);
          return localRel;
        }
      } catch {
        /* continue */
      }
    }
    for (const url of candidateTextureUrls(id)) {
      try {
        if (await downloadTo(localAbs, url)) {
          cache.set(itemId, localRel);
          return localRel;
        }
      } catch {
        /* try next */
      }
    }
  }

  cache.set(itemId, null);
  return null;
}

function parseLangFile(raw) {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const map = new Map();

  // Single-line string entries
  const lineRe = /^\t([A-Za-z0-9_.]+):\s*"(.*)"\s*$/gm;
  let m;
  while ((m = lineRe.exec(text))) {
    map.set(m[1], m[2].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\"));
  }

  // Multi-line string-array entries (quest_desc)
  const arrRe = /^\t([A-Za-z0-9_.]+):\s*\[([\s\S]*?)\]/gm;
  while ((m = arrRe.exec(text))) {
    const key = m[1];
    if (!key.endsWith(".quest_desc") && !key.endsWith(".description")) continue;
    const strings = [];
    const sRe = /"((?:\\.|[^"\\])*)"/g;
    let sm;
    while ((sm = sRe.exec(m[2]))) {
      strings.push(sm[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\"));
    }
    map.set(key, strings.join("\n").replace(/\n{3,}/g, "\n\n").trim());
  }

  return map;
}

function langGet(lang, ...keys) {
  for (const k of keys) {
    if (lang.has(k)) return lang.get(k);
  }
  return "";
}

/* ---------------- main ---------------- */

async function main() {
  console.log("Parsing FTB Quests from", QUESTS_DIR);

  const groupsSnbt = parseSnbt(await fs.readFile(path.join(QUESTS_DIR, "chapter_groups.snbt"), "utf8"));
  const groupOrder = (groupsSnbt.chapter_groups ?? []).map((g) => g.id);

  const lang = parseLangFile(await fs.readFile(path.join(QUESTS_DIR, "lang/en_us.snbt"), "utf8"));

  const chapterFiles = (await fs.readdir(path.join(QUESTS_DIR, "chapters")))
    .filter((f) => f.endsWith(".snbt"))
    .sort();

  const chapters = [];
  for (const file of chapterFiles) {
    const raw = await fs.readFile(path.join(QUESTS_DIR, "chapters", file), "utf8");
    let data;
    try {
      data = parseSnbt(raw);
    } catch (err) {
      console.error("Failed to parse", file, err);
      continue;
    }

    const chapterId = data.id;
    const title = stripFormatting(
      langGet(lang, `chapter.${chapterId}.title`) || data.filename || file.replace(/\.snbt$/, ""),
    );
    const subtitle = stripFormatting(langGet(lang, `chapter.${chapterId}.chapter_subtitle`));

    const chapterIconId = extractIconItemId(data.icon, null);
    const quests = [];

    for (const q of data.quests ?? []) {
      if (!q?.id) continue;
      const qTitle = stripFormatting(langGet(lang, `quest.${q.id}.title`) || "Untitled Quest");
      const qSubtitle = stripFormatting(langGet(lang, `quest.${q.id}.quest_subtitle`));
      const qDesc = stripFormatting(
        langGet(lang, `quest.${q.id}.quest_desc`, `quest.${q.id}.description`),
      );
      let iconItemId = extractIconItemId(q.icon, q.tasks, q.rewards);
      if (!iconItemId) {
        iconItemId = conceptualIconFromTitle(qTitle) || chapterIconId || "minecraft:book";
      }
      const customIcon = extractCustomIconPath(q.icon);
      const deps = Array.isArray(q.dependencies)
        ? q.dependencies.map(String)
        : q.dependencies
          ? [String(q.dependencies)]
          : [];

      quests.push({
        id: String(q.id),
        title: qTitle,
        subtitle: qSubtitle,
        description: qDesc,
        x: Number(q.x ?? 0),
        y: Number(q.y ?? 0),
        size: Number(q.size ?? 1),
        shape: typeof q.shape === "string" && q.shape ? q.shape : null,
        dependencies: deps,
        iconItemId,
        customIcon,
        iconUrl: null,
        iconLabel: iconLabelFrom(qTitle, iconItemId),
        status: "available",
      });
    }

    chapters.push({
      id: String(chapterId),
      filename: data.filename || file.replace(/\.snbt$/, ""),
      title,
      subtitle,
      groupId: data.group ? String(data.group) : "",
      orderIndex: Number(data.order_index ?? 0),
      iconItemId: chapterIconId,
      iconUrl: null,
      iconLabel: iconLabelFrom(title, chapterIconId),
      questCount: quests.length,
      quests,
    });
  }

  // Resolve icons — prefer local jar-extracted pack (icons/), then network fallback
  const iconCache = new Map();
  let localHits = 0;
  let networkHits = 0;
  if (!SKIP_ICONS) {
    await fs.mkdir(OUT_ICONS, { recursive: true });
    const local = await loadLocalIconIndex();
    console.log(
      `Local icon pack: ${local.byItem.size} items, ${local.byQuestId.size} quest-id maps`,
    );

    async function resolveQuestIcon(quest) {
      // Quest-specific file wins (exact FTB node icon from extract)
      const byId = local.byQuestId.get(String(quest.id).toUpperCase());
      if (byId) {
        const rel = await copyLocalIcon(byId, quest.iconItemId || `quest_${quest.id}`);
        localHits++;
        return rel;
      }
      if (quest.iconItemId) {
        if (iconCache.has(quest.iconItemId)) return iconCache.get(quest.iconItemId);
        const localPath = local.byItem.get(quest.iconItemId);
        if (localPath) {
          const rel = await copyLocalIcon(localPath, quest.iconItemId);
          iconCache.set(quest.iconItemId, rel);
          localHits++;
          return rel;
        }
        const remote = await resolveAndCacheIcon(quest.iconItemId, iconCache);
        if (remote) networkHits++;
        return remote;
      }
      return null;
    }

    async function resolveItemIcon(itemId) {
      if (!itemId) return null;
      if (iconCache.has(itemId)) return iconCache.get(itemId);
      const localPath = local.byItem.get(itemId);
      if (localPath) {
        const rel = await copyLocalIcon(localPath, itemId);
        iconCache.set(itemId, rel);
        localHits++;
        return rel;
      }
      const remote = await resolveAndCacheIcon(itemId, iconCache);
      if (remote) networkHits++;
      return remote;
    }

    let done = 0;
    const totalQ = chapters.reduce((s, c) => s + c.quests.length, 0);
    for (const ch of chapters) {
      ch.iconUrl = await resolveItemIcon(ch.iconItemId);
      for (const q of ch.quests) {
        q.iconUrl = await resolveQuestIcon(q);
        done++;
        if (done % 50 === 0 || done === totalQ) {
          process.stdout.write(`\r  icons ${done}/${totalQ} (local ${localHits}, net ${networkHits})`);
        }
      }
    }
    process.stdout.write("\n");
  }

  // Build groups (include empty-group chapters as Getting Started)
  const GROUP_BLURBS = {
    "4578270E41A43681": "Tools, maps, home, and choice: the first pages of your chronicle.",
    "3B8AF43E1258A852": "The kinetic heart of the pack: Create and its deepest branches.",
    "7E80517FB425BBD0": "Dig deeper, forge bigger, and point the result at something.",
    "62A749137B71D06F": "Rail, road, sea, and sky. Move everything, everywhere.",
    "0ED9F00893D42C69": "Feed the crew, brew the calm, and make home worth defending.",
    "2F1B76FFDC1A8831": "Monsters, dungeons, and the gear that outlives them.",
    "32AE22B1D4F114FC": "Magic treated like any other industry: studied, then automated.",
    "59C57AB9716E3A08": "The endgame arc, where machinery finally leaves the planet.",
    "165C7B28A1A813A1": "The soft chapters: family, pets, music, money, and mischief.",
    "2F8B068425AF05D4": "Deep dives into the Create addons that round out the workshop.",
  };

  const byGroup = new Map();
  for (const id of groupOrder) byGroup.set(id, []);
  byGroup.set("", []);

  for (const ch of chapters) {
    const gid = byGroup.has(ch.groupId) ? ch.groupId : "";
    byGroup.get(gid).push(ch);
  }

  for (const list of byGroup.values()) {
    list.sort((a, b) => a.orderIndex - b.orderIndex || a.title.localeCompare(b.title));
  }

  const groups = [];

  // Getting Started (ungrouped)
  const ungrouped = byGroup.get("") ?? [];
  if (ungrouped.length) {
    groups.push({
      id: "getting-started",
      title: "Getting Started",
      blurb: "Session zero: learn the pack, meet the Guide, pick a path.",
      chapters: ungrouped.map(serializeChapter),
    });
  }

  for (const gid of groupOrder) {
    const list = byGroup.get(gid) ?? [];
    if (!list.length) continue;
    const title =
      stripFormatting(langGet(lang, `chapter_group.${gid}.title`)) || `Group ${gid.slice(0, 8)}`;
    groups.push({
      id: gid,
      title,
      blurb: GROUP_BLURBS[gid] ?? "",
      chapters: list.map(serializeChapter),
    });
  }

  const totalChapters = chapters.length;
  const totalQuests = chapters.reduce((s, c) => s + c.quests.length, 0);
  const iconsResolved = [...iconCache.values()].filter(Boolean).length;

  const payload = {
    generatedAt: new Date().toISOString(),
    source: "quests/",
    totalChapters,
    totalQuests,
    iconsResolved,
    iconsAttempted: iconCache.size,
    groups,
  };

  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
  await fs.writeFile(OUT_JSON, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Chapters: ${totalChapters}, Quests: ${totalQuests}`);
  console.log(`Icons: ${iconsResolved}/${iconCache.size || 0} resolved${SKIP_ICONS ? " (skipped)" : ""}`);
}

function serializeChapter(ch) {
  return {
    id: ch.id,
    filename: ch.filename,
    title: ch.title,
    subtitle: ch.subtitle,
    orderIndex: ch.orderIndex,
    iconItemId: ch.iconItemId,
    iconUrl: ch.iconUrl,
    iconLabel: ch.iconLabel,
    questCount: ch.questCount,
    quests: ch.quests.map((q) => ({
      id: q.id,
      title: q.title,
      subtitle: q.subtitle,
      description: q.description,
      x: q.x,
      y: q.y,
      size: q.size,
      shape: q.shape,
      dependencies: q.dependencies,
      iconItemId: q.iconItemId,
      iconUrl: q.iconUrl,
      iconLabel: q.iconLabel,
      status: q.status,
    })),
  };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
