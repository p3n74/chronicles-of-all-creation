export const SERVER_IP = "minecraft.citadel-codex.com";
export const ALT_SERVER_IP = "mc-direct.citadel-codex.com";

export const SITE = {
  name: "Chronicles of All Creation",
  tagline: "From the first cogwheel to the last unmapped star.",
  description:
    "Chronicles of All Creation is a Create-driven modpack where every gear you place is a step off the planet. Master kinetic machinery, string railways and airships across the world, industrialize enchantment itself — then pour crude into a rocket and charter colonies on the Moon, Mars, Venus, and Mercury. A hand-written questbook chronicles the whole ascent, from Session Zero to your own orbital dockyard.",
} as const;

export const FEATURES = [
  {
    title: "Engineer's Paradise",
    description:
      "Create 6 and dozens of hand-picked addons — steam boilers, diesel generators, trains, cannons, jetpacks, and factories limited only by your imagination.",
    icon: "/icons/machinery.png",
    alt: "Brass cogwheels icon",
  },
  {
    title: "Logistics & Travel",
    description:
      "Bridge continents with railway networks, hypertubes, airships, and aircraft. Move people, freight, and whole contraptions across a living overworld.",
    icon: "/icons/logistics.png",
    alt: "Steam locomotive and airship icon",
  },
  {
    title: "Beyond the Cradle",
    description:
      "Follow the Launch Codex: refine rocket fuel, suit up, and lift off. Plant colonial charters on the Moon, Mars, Venus, and Mercury, then raise your own space station.",
    icon: "/icons/exploration.png",
    alt: "Brass rocket and crescent moon icon",
  },
] as const;

export const QUEST_GROUPS = [
  "Adventurer's Primer",
  "Engineer's Paradise",
  "Industry & Ordnance",
  "Logistics & Travel",
  "Hearth & Harvest",
  "Champions of the Realm",
  "Spellwright Codex",
  "Beyond the Cradle",
  "Tavern Tales",
] as const;

export const DOWNLOAD_URL =
  "https://drive.google.com/drive/folders/1X2JwZ1EGbcQS62lT1zhzrnlx_tvregxZ";
