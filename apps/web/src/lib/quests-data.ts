// Sourced from the pack's FTB Quests files (config/ftbquests/quests).
// Chapter groups, titles, subtitles, and quest counts mirror the in-game questbook.

export interface QuestChapter {
  title: string;
  subtitle: string;
  quests: number;
}

export interface QuestGroup {
  id: string;
  title: string;
  blurb: string;
  chapters: QuestChapter[];
}

export const QUEST_GROUPS_DATA: QuestGroup[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    blurb: "Session zero — learn the pack, meet the Guide, pick a path.",
    chapters: [
      { title: "Tutorial", subtitle: "The Guide clears its throat — basics, teams, controls", quests: 6 },
      { title: "To Know", subtitle: "House rules and things worth knowing before you build", quests: 0 },
    ],
  },
  {
    id: "adventurers-primer",
    title: "Adventurer's Primer",
    blurb: "Tools, maps, home, choice — the first pages of your chronicle.",
    chapters: [
      { title: "Adventurer's Primer", subtitle: "Session zero — tools, maps, home, choice", quests: 8 },
    ],
  },
  {
    id: "engineers-paradise",
    title: "Engineer's Paradise",
    blurb: "The kinetic heart of the pack — Create and its deepest branches.",
    chapters: [
      { title: "Create", subtitle: "Cogwheels to contraptions — the full kinetic curriculum", quests: 120 },
      { title: "Pump Dat Oil", subtitle: "Crude, pumpjacks, and diesel — industry finds its fuel", quests: 14 },
      { title: "New Age", subtitle: "Motors, generators, and reactors — kinetics goes electric", quests: 36 },
    ],
  },
  {
    id: "industry-ordnance",
    title: "Industry & Ordnance",
    blurb: "Dig deeper, forge bigger, and point the result at something.",
    chapters: [
      { title: "Vein Delvers", subtitle: "Find the infinite — sample, drill, extract, ascend", quests: 10 },
      { title: "Siegewrights", subtitle: "Build the gun — load, fire, mount, escalate", quests: 10 },
      { title: "Addon Guildhalls", subtitle: "Signposts to Create addon chapters", quests: 7 },
    ],
  },
  {
    id: "logistics-travel",
    title: "Logistics & Travel",
    blurb: "Rail, road, sea, and sky — move everything, everywhere.",
    chapters: [
      { title: "Trains", subtitle: "Tracks, stations, schedules — a railway empire", quests: 23 },
      { title: "Aircrafts", subtitle: "Immersive aircraft and planes — the sky as a shipping lane", quests: 22 },
      { title: "Minecarts", subtitle: "The humble cart, elevated to logistics", quests: 14 },
      { title: "Rubber Road", subtitle: "Automobility — assemble, fuel the myth, drive", quests: 8 },
      { title: "Salt & Sail", subtitle: "Small Ships — canvas, hull, fleet, broadside", quests: 9 },
      { title: "Glass Arteries", subtitle: "Hypertubes — pipe the player like a package", quests: 7 },
      { title: "Personal Relics", subtitle: "Jetpack — vertical freedom with Create manners", quests: 4 },
      { title: "Skywright's Leviathan", subtitle: "Create Aeronautics — lift, thrust, cannons, flying hold", quests: 33 },
    ],
  },
  {
    id: "hearth-harvest",
    title: "Hearth & Harvest",
    blurb: "Feed the crew, brew the calm, and make home worth defending.",
    chapters: [
      { title: "Create Kitchen", subtitle: "Central Kitchen — automate every course", quests: 22 },
      { title: "Confectionery", subtitle: "Chocolate, candy, and a factory of sweets", quests: 27 },
      { title: "Pantry of Many Seeds", subtitle: "Pam's Crops — plant the empire's groceries", quests: 8 },
      { title: "Tea & Temper", subtitle: "Farmer's Respite — brew calm, then caffeine", quests: 8 },
      { title: "Hold Beautification", subtitle: "Comforts — sleep anywhere, nap with style", quests: 4 },
    ],
  },
  {
    id: "champions",
    title: "Champions of the Realm",
    blurb: "Monsters, dungeons, and the gear that outlives them.",
    chapters: [
      { title: "Arms Practice", subtitle: "Stance, spoils, forged gear, curios", quests: 9 },
      { title: "Bestiary of Nightmares", subtitle: "Mutants, Chemical X, Cataclysm, and Illagers", quests: 10 },
      { title: "Depths, Caves & Other Realms", subtitle: "Ancient City → Otherside → Galosphere → Starlight", quests: 10 },
      { title: "Dungeon Delver's League", subtitle: "Structures — loot is the only passport", quests: 9 },
      { title: "Gunsmith's Ballad", subtitle: "Guns, ammo, magazines, attachments", quests: 21 },
      { title: "Catalog of the Rotten", subtitle: "Rotten Creatures — freeze, fire, pirates, storms", quests: 11 },
      { title: "Forge of Silent Legends", subtitle: "Silent Gear — blueprints, crimson, azure, starlight", quests: 21 },
      { title: "Hymn of Eternal Starlight", subtitle: "Gatekeeper → biomes → Golem & Monstrosity → Unrealium", quests: 27 },
    ],
  },
  {
    id: "spellwright-codex",
    title: "Spellwright Codex",
    blurb: "Magic treated like any other industry — studied, then automated.",
    chapters: [
      { title: "First Cantrips", subtitle: "Iron's Spellbooks — loot, inscribe, forge, ascend", quests: 17 },
      { title: "Apotheosis Ascension", subtitle: "Affixes, gems, reforging — loot as destiny", quests: 8 },
      { title: "Industrial Thaumaturgy", subtitle: "Enchantment Industry — automate the sacred", quests: 8 },
    ],
  },
  {
    id: "beyond-the-cradle",
    title: "Beyond the Cradle",
    blurb: "The endgame arc — machinery finally leaves the planet.",
    chapters: [
      { title: "Metallurgy of the Void", subtitle: "Steel → oxygen chain → oil → rocket fuel", quests: 12 },
      { title: "Launch Codex", subtitle: "Rocket Station → pads → fuel → space", quests: 9 },
      { title: "Colonial Charter", subtitle: "Flag → sealed air → rover → Moon/Mars/Venus/Mercury", quests: 20 },
      { title: "Orbital Dockyards", subtitle: "Antenna → modules → Small/Medium/Big Space Station", quests: 18 },
    ],
  },
  {
    id: "tavern-tales",
    title: "Tavern Tales",
    blurb: "The soft chapters — family, pets, music, money, and mischief.",
    chapters: [
      { title: "Hearts & Homesteads", subtitle: "MCA — romance, rings, family lore", quests: 5 },
      { title: "Menagerie", subtitle: "Hamsters — morale as a combat buff", quests: 5 },
      { title: "Bard's Corner", subtitle: "Exposure & Etched — capture and score the tale", quests: 8 },
      { title: "Coin & Contract", subtitle: "Numismatics & Bountiful — pay, hire, prosper", quests: 7 },
      { title: "Chaos Dice", subtitle: "Carry On & lucky nonsense — optional entropy", quests: 4 },
    ],
  },
  {
    id: "guildhall-addons",
    title: "Guildhall Addons",
    blurb: "Deep dives into the Create addons that round out the workshop.",
    chapters: [
      { title: "Aquatic Ambitions", subtitle: "Create under the waves — copper diving and more", quests: 25 },
      { title: "Optical", subtitle: "Lenses, lasers, and light-bending contraptions", quests: 28 },
      { title: "Enchantment Industry", subtitle: "Liquid experience on an industrial scale", quests: 11 },
      { title: "BB Fuels", subtitle: "New fuels for Blaze Burners and boiler setups", quests: 26 },
      { title: "Deep Dark", subtitle: "End-game gear forged from the sculk", quests: 13 },
      { title: "Totem Factory", subtitle: "Mass-produce the ultimate second chance", quests: 14 },
      { title: "Fun Additions", subtitle: "Gadgets and toys from across the addon shelf", quests: 18 },
      { title: "Connected", subtitle: "Create Connected — gearboxes, couplings, and control", quests: 35 },
    ],
  },
];

export const TOTAL_QUESTS = QUEST_GROUPS_DATA.reduce(
  (sum, group) => sum + group.chapters.reduce((s, c) => s + c.quests, 0),
  0,
);

export const TOTAL_CHAPTERS = QUEST_GROUPS_DATA.reduce(
  (sum, group) => sum + group.chapters.length,
  0,
);
