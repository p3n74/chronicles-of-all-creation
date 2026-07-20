export const SERVER_IP = "minecraft.citadel-codex.com";
export const ALT_SERVER_IP = "mc-direct.citadel-codex.com";

export const SITE = {
  name: "Chronicles of All Creation",
  tagline: "From the first cogwheel to the last unmapped star.",
  description:
    "A Create-driven modpack where every gear is a step off the planet. Master kinetics, string railways and airships across the overworld, then refine fuel and charter colonies on the Moon, Mars, Venus, and Mercury. A hand-written questbook charts the ascent from Session Zero to orbital dockyard.",
} as const;

export const FEATURES = [
  {
    title: "Kinetic industry",
    description:
      "Create 6 plus curated addons: boilers, diesel, trains, cannons, jetpacks, and factories limited by what you can power.",
    icon: "/icons/machinery.png",
    alt: "Brass cogwheels",
  },
  {
    title: "Freight and flight",
    description:
      "Railways, hypertubes, airships, and aircraft move people, freight, and whole contraptions across a living world.",
    icon: "/icons/logistics.png",
    alt: "Locomotive and airship",
  },
  {
    title: "Off-world charters",
    description:
      "Refine rocket fuel, suit up, and lift off. Plant colonies on the Moon, Mars, Venus, and Mercury, then raise a station.",
    icon: "/icons/exploration.png",
    alt: "Brass rocket and moon",
  },
] as const;

/** Questbook chapter groups with their real in-game pack icons. */
export const QUEST_GROUPS = [
  { title: "Adventurer's Primer", icon: "/quest-icons/naturescompass__naturescompass.png" },
  { title: "Engineer's Paradise", icon: "/quest-icons/create__cogwheel.png" },
  { title: "Industry & Ordnance", icon: "/quest-icons/createbigcannons__cannon_mount.png" },
  { title: "Logistics & Travel", icon: "/quest-icons/create__track.png" },
  { title: "Hearth & Harvest", icon: "/quest-icons/minecraft__bread.png" },
  { title: "Champions of the Realm", icon: "/quest-icons/minecraft__diamond_sword.png" },
  { title: "Spellwright Codex", icon: "/quest-icons/irons_spellbooks__inscription_table.png" },
  { title: "Beyond the Cradle", icon: "/quest-icons/stellaris__rocket.png" },
  { title: "Tavern Tales", icon: "/quest-icons/mca__engagement_ring.png" },
] as const;

export const DOWNLOAD_URL =
  "https://drive.google.com/drive/folders/1X2JwZ1EGbcQS62lT1zhzrnlx_tvregxZ";
