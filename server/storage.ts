import type { Character, ArtifactSet, Team, InsertCharacter, InsertArtifactSet, InsertTeam } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllCharacters(): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | undefined>;
  getAllArtifacts(): Promise<ArtifactSet[]>;
  getAllTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private characters: Map<string, Character>;
  private artifacts: Map<string, ArtifactSet>;
  private teams: Map<string, Team>;

  constructor() {
    this.characters = new Map();
    this.artifacts = new Map();
    this.teams = new Map();
    this.seedData();
  }

  private seedData() {
    const characters: Character[] = [
      {
        id: "diluc",
        name: "Diluc",
        element: "Pyro",
        weapon: "Claymore",
        rarity: 5,
        region: "Mondstadt",
        role: "DPS",
        description: "The uncrowned king of Mondstadt, a tycoon and a formidable warrior.",
        lore: "As the wealthiest gentleman in Mondstadt, the ever-dapper Diluc always presents himself as the epitome of perfection. But behind the courteous visage burns a zealous soul that has sworn to protect Mondstadt at all costs, allowing him to mercilessly vanquish all who threaten his city.",
        talents: "Prioritize Normal Attack > Elemental Burst > Elemental Skill. Level Normal Attack to 9-10 first for maximum DPS output.",
        recommendedArtifacts: ["Crimson Witch of Flames", "Gladiator's Finale"],
        recommendedWeapons: ["Wolf's Gravestone", "Serpent Spine", "Prototype Archaic"],
        buildPriority: "Focus on ATK%, Pyro DMG Bonus, and Crit Rate/DMG. Aim for 60%+ Crit Rate and 120%+ Crit DMG. EM substats are valuable for reaction teams.",
        constellations: "C1 provides a significant damage boost. C2 increases ATK and attack speed. C4 is a major power spike. C6 reduces skill cooldown and increases damage after burst.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Diluc.png"
      },
      {
        id: "hu-tao",
        name: "Hu Tao",
        element: "Pyro",
        weapon: "Polearm",
        rarity: 5,
        region: "Liyue",
        role: "DPS",
        description: "The 77th Director of the Wangsheng Funeral Parlor, quirky and cheerful.",
        lore: "Despite her position as the Director of the Wangsheng Funeral Parlor, Hu Tao is a lively and eccentric young woman. She loves to play pranks on people and has an unusual sense of humor. However, she takes her duties very seriously and works hard to uphold the parlor's traditions.",
        talents: "Prioritize Normal Attack > Elemental Skill > Elemental Burst. Max out Normal Attack first, then Skill for damage conversion.",
        recommendedArtifacts: ["Crimson Witch of Flames", "Shimenawa's Reminiscence"],
        recommendedWeapons: ["Staff of Homa", "Dragon's Bane", "Deathmatch"],
        buildPriority: "Focus on HP%, Pyro DMG Bonus, and Crit Rate/DMG. Keep HP below 50% during Skill for maximum damage. Aim for 30k+ HP and good crit ratios.",
        constellations: "C1 removes stamina cost during skill. C6 is game-changing, preventing death and boosting crit rate massively.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Hutao.png"
      },
      {
        id: "raiden-shogun",
        name: "Raiden Shogun",
        element: "Electro",
        weapon: "Polearm",
        rarity: 5,
        region: "Inazuma",
        role: "Sub-DPS",
        description: "The Electro Archon, embodying eternity and ruling over Inazuma.",
        lore: "The Raiden Shogun is the awesome and terrible power of thunder incarnate, the exalted ruler of the Inazuma Shogunate. With the might of lightning at her disposal, she commits herself to the solitary pursuit of eternity.",
        talents: "Prioritize Elemental Burst > Elemental Skill > Normal Attack. Burst is your main damage source and battery capability.",
        recommendedArtifacts: ["Emblem of Severed Fate", "The Exile"],
        recommendedWeapons: ["Engulfing Lightning", "The Catch", "Grasscutter's Light"],
        buildPriority: "Stack Energy Recharge (250-280%), then ATK% and Crit Rate/DMG. Electro DMG Bonus is valuable. Her burst scales with ER.",
        constellations: "C2 is a massive power spike, ignoring 60% DEF during burst. C3 increases burst level. C6 reduces cooldown significantly.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Raiden.png"
      },
      {
        id: "nahida",
        name: "Nahida",
        element: "Dendro",
        weapon: "Catalyst",
        rarity: 5,
        region: "Sumeru",
        role: "Support",
        description: "The Dendro Archon, embodiment of wisdom and knowledge.",
        lore: "The Dendro Archon, Lesser Lord Kusanali, is the God of Wisdom who resides in Sumeru. Despite her young appearance, she possesses vast knowledge and cares deeply for her people and the preservation of knowledge.",
        talents: "Prioritize Elemental Skill > Elemental Burst > Normal Attack. Skill is your primary damage and application source.",
        recommendedArtifacts: ["Deepwood Memories", "Gilded Dreams"],
        recommendedWeapons: ["A Thousand Floating Dreams", "Sacrificial Fragments", "Magic Guide"],
        buildPriority: "Focus on Elemental Mastery (800-1000), then Crit Rate/DMG. EM is her best stat for both damage and buff strength.",
        constellations: "C1 extends skill duration. C2 is a major boost to Dendro reactions. C6 increases crit rate and damage massively.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Nahida.png"
      },
      {
        id: "furina",
        name: "Furina",
        element: "Hydro",
        weapon: "Sword",
        rarity: 5,
        region: "Fontaine",
        role: "Support",
        description: "The Hydro Archon, actress extraordinaire and ruler of Fontaine.",
        lore: "Furina, the Hydro Archon, is known for her theatrical personality and love of performance. As the God of Justice, she presides over Fontaine's Court of Justice with flair and showmanship, though she carries hidden burdens.",
        talents: "Prioritize Elemental Skill > Elemental Burst > Normal Attack. Skill provides consistent damage and buffs.",
        recommendedArtifacts: ["Golden Troupe", "Tenacity of the Millelith"],
        recommendedWeapons: ["Splendor of Tranquil Waters", "Festering Desire", "Fleuve Cendre Ferryman"],
        buildPriority: "Focus on HP% for maximum buff strength and damage. Crit Rate/DMG for personal damage. Energy Recharge to maintain burst uptime.",
        constellations: "C1 grants HP drain immunity. C2 boosts Fanfare generation. C6 provides massive crit damage boost to team.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Furina.png"
      },
      {
        id: "zhongli",
        name: "Zhongli",
        element: "Geo",
        weapon: "Polearm",
        rarity: 5,
        region: "Liyue",
        role: "Support",
        description: "The Geo Archon, consultant of the Wangsheng Funeral Parlor.",
        lore: "A mysterious expert contracted by the Wangsheng Funeral Parlor. Extremely knowledgeable in all things. The identity behind Zhongli is the Geo Archon, Rex Lapis, who has watched over Liyue for millennia.",
        talents: "Prioritize Elemental Skill > Elemental Burst > Normal Attack. Shield strength scales with skill level.",
        recommendedArtifacts: ["Tenacity of the Millelith", "Archaic Petra"],
        recommendedWeapons: ["Staff of Homa", "Black Tassel", "Favonius Lance"],
        buildPriority: "Build full HP (50k+) for strongest shield. Focus on HP% on all pieces. Some ER for burst uptime.",
        constellations: "C1 adds second pillar. C2 adds shield to burst. C6 provides healing when shielded.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Zhongli.png"
      },
      {
        id: "xiangling",
        name: "Xiangling",
        element: "Pyro",
        weapon: "Polearm",
        rarity: 4,
        region: "Liyue",
        role: "Sub-DPS",
        description: "A renowned chef from Liyue Harbor, always seeking new ingredients.",
        lore: "A skilled chef from Liyue, Xiangling's Pyronado is one of the most powerful off-field abilities in the game. She is enthusiastic about cooking and always on the lookout for new ingredients.",
        talents: "Prioritize Elemental Burst > Elemental Skill > Normal Attack. Burst is your main DPS source.",
        recommendedArtifacts: ["Emblem of Severed Fate", "Crimson Witch of Flames"],
        recommendedWeapons: ["The Catch", "Dragon's Bane", "Favonius Lance"],
        buildPriority: "Focus on ER (180-200%), then ATK%, Pyro DMG, and Crit Rate/DMG. Need ER to maintain burst uptime.",
        constellations: "C4 extends burst duration by 40%, a huge boost. C6 increases Pyro DMG bonus.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Xiangling.png"
      },
      {
        id: "bennett",
        name: "Bennett",
        element: "Pyro",
        weapon: "Sword",
        rarity: 4,
        region: "Mondstadt",
        role: "Support",
        description: "An unlucky adventurer whose burst provides massive ATK buffs.",
        lore: "A good-natured adventurer who leads Benny's Adventure Team. Despite his constant misfortune, Bennett remains optimistic and is one of the best supports in Teyvat.",
        talents: "Prioritize Elemental Burst > Elemental Skill > Normal Attack. Burst level directly affects ATK buff.",
        recommendedArtifacts: ["Noblesse Oblige", "Crimson Witch of Flames"],
        recommendedWeapons: ["Aquila Favonia", "Prototype Rancour", "Sapwood Blade"],
        buildPriority: "Focus on ER (200-250%), then HP% for healing. Use highest base ATK weapon possible for buff strength.",
        constellations: "C1 adds ATK boost and removes HP restriction. STOP AT C5 - do not activate C6 unless using with Pyro DPS only.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Bennett.png"
      },
      {
        id: "fischl",
        name: "Fischl",
        element: "Electro",
        weapon: "Bow",
        rarity: 4,
        region: "Mondstadt",
        role: "Sub-DPS",
        description: "A mysterious girl who calls herself 'Prinzessin der Verurteilung'.",
        lore: "An investigator for the Adventurers' Guild, Fischl is accompanied by the night raven Oz. She roleplays as a mysterious princess from another world.",
        talents: "Prioritize Elemental Skill > Elemental Burst > Normal Attack. Oz is your main damage source.",
        recommendedArtifacts: ["Thundering Fury", "Golden Troupe"],
        recommendedWeapons: ["Stringless", "Alley Hunter", "Windblume Ode"],
        buildPriority: "Focus on ATK%, Electro DMG Bonus, and Crit Rate/DMG. Some ER for burst uptime (120-140%).",
        constellations: "C6 is a massive boost, making Oz attack with your active character. C1 adds extra damage when he's on field.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png"
      },
      {
        id: "kazuha",
        name: "Kaedehara Kazuha",
        element: "Anemo",
        weapon: "Sword",
        rarity: 5,
        region: "Inazuma",
        role: "Support",
        description: "A wandering samurai from Inazuma, providing powerful buffs.",
        lore: "A wandering samurai of the once-famed Kaedehara Clan, Kazuha is a gentle soul who can read the sounds of nature. He values freedom above all else.",
        talents: "Prioritize Elemental Skill > Elemental Burst > Normal Attack. Skill provides grouping and elemental buff.",
        recommendedArtifacts: ["Viridescent Venerer", "Instructor"],
        recommendedWeapons: ["Freedom-Sworn", "Iron Sting", "Xiphos' Moonlight"],
        buildPriority: "Stack Elemental Mastery (800-1000) for maximum buffing. Some ER (160-180%) for burst uptime.",
        constellations: "C1 reduces skill CD. C2 boosts EM massively. C6 grants Anemo infusion after burst or skill.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Kazuha.png"
      },
      {
        id: "ganyu",
        name: "Ganyu",
        element: "Cryo",
        weapon: "Bow",
        rarity: 5,
        region: "Liyue",
        role: "DPS",
        description: "Secretary of Liyue Qixing, half-human, half-qilin adeptus.",
        lore: "The secretary at Yuehai Pavilion. The blood of the qilin, an illuminated beast, flows within her veins. She is incredibly powerful with charged shots.",
        talents: "Prioritize Normal Attack > Elemental Burst > Elemental Skill. Charged shots are your main damage.",
        recommendedArtifacts: ["Wanderer's Troupe", "Blizzard Strayer"],
        recommendedWeapons: ["Amos' Bow", "Prototype Crescent", "Hamayumi"],
        buildPriority: "Focus on ATK%, Cryo DMG Bonus, and Crit DMG (200%+). In freeze teams, minimize Crit Rate due to resonance.",
        constellations: "C1 reduces Cryo RES. C4 increases damage in burst. C6 grants extra charged shot after first one.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Ganyu.png"
      },
      {
        id: "ayaka",
        name: "Kamisato Ayaka",
        element: "Cryo",
        weapon: "Sword",
        rarity: 5,
        region: "Inazuma",
        role: "DPS",
        description: "The elegant daughter of the Kamisato Clan, Yashiro Commissioner.",
        lore: "Daughter of the Kamisato Clan from Inazuma, Ayaka is elegant, graceful, and incredibly powerful. Her burst can deal massive damage to frozen enemies.",
        talents: "Prioritize Elemental Burst > Normal Attack > Elemental Skill. Burst is your main damage window.",
        recommendedArtifacts: ["Blizzard Strayer", "Gladiator's Finale"],
        recommendedWeapons: ["Mistsplitter Reforged", "Amenoma Kageuchi", "Blackcliff Longsword"],
        buildPriority: "Focus on ATK%, Cryo DMG Bonus, and Crit DMG. In freeze teams, aim for 30-40% Crit Rate only.",
        constellations: "C1 reduces skill CD. C2 creates additional ice swords. C4 boosts burst damage massively. C6 reduces charged attack stamina cost.",
        imageUrl: "https://enka.network/ui/UI_AvatarIcon_Ayaka.png"
      },
    ];

    const artifacts: ArtifactSet[] = [
      {
        id: "crimson-witch",
        name: "Crimson Witch of Flames",
        twoPieceBonus: "Pyro DMG Bonus +15%",
        fourPieceBonus: "Increases Overloaded, Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using an Elemental Skill increases 2-Piece Set effects by 50% for 10s. Max 3 stacks.",
        domain: "Hidden Palace of Zhou Formula",
        recommendedFor: ["Diluc", "Hu Tao", "Klee", "Yoimiya"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15014.png"
      },
      {
        id: "emblem-severed-fate",
        name: "Emblem of Severed Fate",
        twoPieceBonus: "Energy Recharge +20%",
        fourPieceBonus: "Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.",
        domain: "Momiji-Dyed Court",
        recommendedFor: ["Raiden Shogun", "Xiangling", "Xingqiu", "Yelan", "Beidou"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15019.png"
      },
      {
        id: "noblesse-oblige",
        name: "Noblesse Oblige",
        twoPieceBonus: "Elemental Burst DMG +20%",
        fourPieceBonus: "Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.",
        domain: "Clear Pool and Mountain Cavern",
        recommendedFor: ["Bennett", "Diona", "Mona", "Zhongli"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15003.png"
      },
      {
        id: "viridescent-venerer",
        name: "Viridescent Venerer",
        twoPieceBonus: "Anemo DMG Bonus +15%",
        fourPieceBonus: "Increases Swirl DMG by 60%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s.",
        domain: "Valley of Remembrance",
        recommendedFor: ["Kazuha", "Venti", "Sucrose", "Wanderer", "Xiao"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15007.png"
      },
      {
        id: "blizzard-strayer",
        name: "Blizzard Strayer",
        twoPieceBonus: "Cryo DMG Bonus +15%",
        fourPieceBonus: "When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.",
        domain: "Peak of Vindagnyr",
        recommendedFor: ["Ayaka", "Ganyu", "Kaeya", "Rosaria"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15008.png"
      },
      {
        id: "tenacity-millelith",
        name: "Tenacity of the Millelith",
        twoPieceBonus: "HP +20%",
        fourPieceBonus: "When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by 20% and their Shield Strength is increased by 30% for 3s. This effect can be triggered once every 0.5s.",
        domain: "Ridge Watch",
        recommendedFor: ["Zhongli", "Kokomi", "Fischl", "Furina"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15017.png"
      },
      {
        id: "deepwood-memories",
        name: "Deepwood Memories",
        twoPieceBonus: "Dendro DMG Bonus +15%",
        fourPieceBonus: "After Elemental Skills or Bursts hit opponents, the targets' Dendro RES will be decreased by 30% for 8s. This effect can be triggered even if the equipping character is not on the field.",
        domain: "Spire of Solitary Enlightenment",
        recommendedFor: ["Nahida", "Tighnari", "Collei", "Baizhu"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15020.png"
      },
      {
        id: "gilded-dreams",
        name: "Gilded Dreams",
        twoPieceBonus: "Elemental Mastery +80",
        fourPieceBonus: "Within 8s of triggering an Elemental Reaction: ATK +14% for each party member whose element matches wearer, and EM +50 for each different. Each effect can stack up to 3 times.",
        domain: "Spire of Solitary Enlightenment",
        recommendedFor: ["Nahida", "Kuki Shinobu", "Thoma", "Nilou"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15020.png"
      },
      {
        id: "golden-troupe",
        name: "Golden Troupe",
        twoPieceBonus: "Elemental Skill DMG +25%",
        fourPieceBonus: "Increases Elemental Skill DMG by 25%. Additionally, when not on the field, Elemental Skill DMG will be increased by a further 25%. This effect will be cleared 2s after taking the field.",
        domain: "Denouement of Sin",
        recommendedFor: ["Furina", "Fischl", "Yae Miko", "Albedo"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15023.png"
      },
      {
        id: "wanderers-troupe",
        name: "Wanderer's Troupe",
        twoPieceBonus: "Elemental Mastery +80",
        fourPieceBonus: "Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.",
        domain: "Elite Bosses",
        recommendedFor: ["Ganyu", "Tighnari", "Yanfei", "Wanderer"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15006.png"
      },
      {
        id: "shimenawa-reminiscence",
        name: "Shimenawa's Reminiscence",
        twoPieceBonus: "ATK +18%",
        fourPieceBonus: "When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by 50% for 10s.",
        domain: "Momiji-Dyed Court",
        recommendedFor: ["Hu Tao", "Yoimiya", "Ayato"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15018.png"
      },
      {
        id: "gladiators-finale",
        name: "Gladiator's Finale",
        twoPieceBonus: "ATK +18%",
        fourPieceBonus: "If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.",
        domain: "Elite Bosses",
        recommendedFor: ["Diluc", "Razor", "Noelle", "Xiao"],
        types: ["Flower", "Feather", "Sands", "Goblet", "Circlet"],
        imageUrl: "https://enka.network/ui/UI_RelicIcon_15001.png"
      },
    ];

    characters.forEach(char => this.characters.set(char.id, char));
    artifacts.forEach(art => this.artifacts.set(art.id, art));
  }

  async getAllCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getAllArtifacts(): Promise<ArtifactSet[]> {
    return Array.from(this.artifacts.values());
  }

  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = randomUUID();
    const team: Team = { ...insertTeam, id };
    this.teams.set(id, team);
    return team;
  }

  async deleteTeam(id: string): Promise<void> {
    this.teams.delete(id);
  }
}

export const storage = new MemStorage();
