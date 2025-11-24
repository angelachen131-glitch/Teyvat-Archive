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
      { id: "diluc", name: "Diluc", element: "Pyro", weapon: "Claymore", rarity: 5, region: "Mondstadt", role: "DPS", description: "The Darknight Hero", lore: "Master of the Mansion of the Woods", talents: "Prioritize Normal Attack > Elemental Burst", recommendedArtifacts: ["Crimson Witch"], recommendedWeapons: ["Wolfs Gravestone"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boosts damage", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Diluc.png" },
      { id: "hu-tao", name: "Hu Tao", element: "Pyro", weapon: "Polearm", rarity: 5, region: "Liyue", role: "DPS", description: "Director of Wangsheng", lore: "Funeral Parlor Director", talents: "Prioritize Normal Attack > Skill", recommendedArtifacts: ["Crimson Witch"], recommendedWeapons: ["Staff of Homa"], buildPriority: "HP%, Pyro DMG, Crit", constellations: "C6 is gamechanging", imageUrl: "https://enka.network/ui/UI_AvatarIcon_HuTao.png" },
      { id: "raiden-shogun", name: "Raiden Shogun", element: "Electro", weapon: "Polearm", rarity: 5, region: "Inazuma", role: "Sub-DPS", description: "The Electro Archon", lore: "Ruler of Inazuma", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["The Catch"], buildPriority: "ER, ATK%, Electro DMG", constellations: "C2 massive power spike", imageUrl: "https://enka.network/ui/UI_AvatarIcon_RaidenShogun.png" },
      { id: "nahida", name: "Nahida", element: "Dendro", weapon: "Catalyst", rarity: 5, region: "Sumeru", role: "Support", description: "Dendro Archon", lore: "God of Wisdom", talents: "Prioritize Skill > Burst", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["A Thousand Dreams"], buildPriority: "EM, Crit, Dendro DMG", constellations: "C2 major boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Nahida.png" },
      { id: "furina", name: "Furina", element: "Hydro", weapon: "Sword", rarity: 5, region: "Fontaine", role: "Support", description: "Hydro Archon", lore: "Ruler of Fontaine", talents: "Prioritize Skill > Burst", recommendedArtifacts: ["Golden Troupe"], recommendedWeapons: ["Splendor"], buildPriority: "HP%, Crit, Hydro DMG", constellations: "C6 crit boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Furina.png" },
      { id: "zhongli", name: "Zhongli", element: "Geo", weapon: "Polearm", rarity: 5, region: "Liyue", role: "Support", description: "Geo Archon", lore: "Rex Lapis", talents: "Prioritize Skill > Burst", recommendedArtifacts: ["Tenacity"], recommendedWeapons: ["Black Tassel"], buildPriority: "HP%, Shield Strength", constellations: "C1 second pillar", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Zhongli.png" },
      { id: "xiangling", name: "Xiangling", element: "Pyro", weapon: "Polearm", rarity: 4, region: "Liyue", role: "Sub-DPS", description: "Chef from Liyue", lore: "Works at Wanmin Restaurant", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["The Catch"], buildPriority: "ER, ATK%, Pyro DMG", constellations: "C4 major boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Xiangling.png" },
      { id: "bennett", name: "Bennett", element: "Pyro", weapon: "Sword", rarity: 4, region: "Mondstadt", role: "Support", description: "Adventurer", lore: "Leader of Adventure Team", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Aquila"], buildPriority: "ER, ATK%, Healing", constellations: "C1 great buff", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Bennett.png" },
      { id: "fischl", name: "Fischl", element: "Electro", weapon: "Bow", rarity: 4, region: "Mondstadt", role: "Sub-DPS", description: "Investigator", lore: "Guild Investigator", talents: "Prioritize Skill > Burst", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["Stringless"], buildPriority: "EM, ATK%, Electro DMG", constellations: "C6 best support", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png" },
      { id: "kazuha", name: "Kaedehara Kazuha", element: "Anemo", weapon: "Sword", rarity: 5, region: "Inazuma", role: "Support", description: "Wandering Swordsman", lore: "From Inazuma", talents: "Prioritize Skill > Burst", recommendedArtifacts: ["Viridescent"], recommendedWeapons: ["Freedom-Sworn"], buildPriority: "EM, ER, ATK%", constellations: "C2 EM boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Kazuha.png" },
      { id: "ganyu", name: "Ganyu", element: "Cryo", weapon: "Bow", rarity: 5, region: "Liyue", role: "DPS", description: "Qixing Secretary", lore: "Half-Qilin", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Wanderers"], recommendedWeapons: ["Amos"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "C1 RES reduction", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Ganyu.png" },
      { id: "ayaka", name: "Kamisato Ayaka", element: "Cryo", weapon: "Sword", rarity: 5, region: "Inazuma", role: "DPS", description: "Yashiro Commissioner", lore: "Kamisato Clan", talents: "Prioritize Burst > Normal Attack", recommendedArtifacts: ["Blizzard"], recommendedWeapons: ["Mistsplitter"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "C4 burst boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Ayaka.png" },
      { id: "venti", name: "Venti", element: "Anemo", weapon: "Bow", rarity: 5, region: "Mondstadt", role: "Support", description: "Anemo Archon", lore: "The Bard", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Viridescent"], recommendedWeapons: ["Elegy"], buildPriority: "EM, ER, ATK%", constellations: "C6 big boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Venti.png" },
      { id: "xingqiu", name: "Xingqiu", element: "Hydro", weapon: "Sword", rarity: 4, region: "Liyue", role: "Support", description: "Bookkeeper", lore: "Pavillion worker", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Sac Sword"], buildPriority: "ER, ATK%, Hydro DMG", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Xingqiu.png" },
      { id: "kokomi", name: "Sangonomiya Kokomi", element: "Hydro", weapon: "Catalyst", rarity: 5, region: "Inazuma", role: "Healer", description: "Sangonomiya Heir", lore: "Watatsumi Leader", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Ocean Clam"], recommendedWeapons: ["Thrilling Tales"], buildPriority: "HP%, Healing, ER", constellations: "C1 extend", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Kokomi.png" },
      { id: "mona", name: "Mona", element: "Hydro", weapon: "Catalyst", rarity: 5, region: "Mondstadt", role: "Support", description: "Astrologer", lore: "Fortune Teller", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Thrilling"], buildPriority: "ER, ATK%, Hydro DMG", constellations: "C1 extend", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Mona.png" },
      { id: "alhaitham", name: "Alhaitham", element: "Dendro", weapon: "Sword", rarity: 5, region: "Sumeru", role: "DPS", description: "Akademiya Scholar", lore: "Scribe", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Foliar"], buildPriority: "EM, ATK%, Dendro DMG", constellations: "C2 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Alhaitham.png" },
      { id: "yelan", name: "Yelan", element: "Hydro", weapon: "Bow", rarity: 5, region: "Liyue", role: "Sub-DPS", description: "Broker", lore: "Shadow Worker", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Aqua"], buildPriority: "ER, ATK%, Crit", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Yelan.png" },
      { id: "xiao", name: "Xiao", element: "Anemo", weapon: "Polearm", rarity: 5, region: "Liyue", role: "DPS", description: "Yaksha", lore: "Vigilant Guardian", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Viridescent"], recommendedWeapons: ["Primordial"], buildPriority: "ATK%, Anemo DMG, Crit", constellations: "C1 extend", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Xiao.png" },
      { id: "jean", name: "Jean", element: "Anemo", weapon: "Sword", rarity: 5, region: "Mondstadt", role: "Support", description: "Grand Master", lore: "Knights Leader", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Viridescent"], recommendedWeapons: ["Aquila"], buildPriority: "ATK%, Anemo DMG, ER", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Jean.png" },
      { id: "barbara", name: "Barbara", element: "Hydro", weapon: "Catalyst", rarity: 4, region: "Mondstadt", role: "Healer", description: "Deaconess", lore: "Church Worker", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Maiden"], recommendedWeapons: ["Thrilling"], buildPriority: "ATK%, Healing, ER", constellations: "C6 revive", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Barbara.png" },
      { id: "beidou", name: "Beidou", element: "Electro", weapon: "Claymore", rarity: 4, region: "Liyue", role: "Sub-DPS", description: "Fleet Captain", lore: "Crux Leader", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Wolfs"], buildPriority: "ER, ATK%, Crit", constellations: "C6 chain", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Beidou.png" },
      { id: "keqing", name: "Keqing", element: "Electro", weapon: "Sword", rarity: 5, region: "Liyue", role: "DPS", description: "Yuheng", lore: "Qixing Member", talents: "Prioritize Normal Attack > Skill", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Mistsplitter"], buildPriority: "ATK%, Electro DMG, Crit", constellations: "C1 enhance", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Keqing.png" },
      { id: "tighnari", name: "Tighnari", element: "Dendro", weapon: "Bow", rarity: 5, region: "Sumeru", role: "DPS", description: "Forest Ranger", lore: "Nature Guide", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["Prototype"], buildPriority: "EM, ATK%, Dendro DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Tighnari.png" },
      { id: "dehya", name: "Dehya", element: "Pyro", weapon: "Claymore", rarity: 5, region: "Desert", role: "DPS", description: "Mercenary", lore: "Desert Fighter", talents: "Prioritize Normal Attack > Skill", recommendedArtifacts: ["Crimson"], recommendedWeapons: ["Wolfs"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Dehya.png" },
      { id: "sucrose", name: "Sucrose", element: "Anemo", weapon: "Catalyst", rarity: 4, region: "Mondstadt", role: "Support", description: "Alchemist", lore: "Lab Assistant", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Viridescent"], recommendedWeapons: ["Sac Frag"], buildPriority: "EM, ER, ATK%", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Sucrose.png" },
      { id: "diona", name: "Diona", element: "Cryo", weapon: "Bow", rarity: 4, region: "Mondstadt", role: "Support", description: "Bartender", lore: "Cat Maid", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Sac Bow"], buildPriority: "ER, HP%, Healing", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Diona.png" },
      { id: "amber", name: "Amber", element: "Pyro", weapon: "Bow", rarity: 4, region: "Mondstadt", role: "Sub-DPS", description: "Outrider", lore: "Gliding Champion", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Wanderers"], recommendedWeapons: ["Prototype"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Amber.png" },
      { id: "noelle", name: "Noelle", element: "Geo", weapon: "Claymore", rarity: 4, region: "Mondstadt", role: "DPS", description: "Maid", lore: "Knights Maid", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Prototype"], buildPriority: "DEF%, Geo DMG, Crit", constellations: "C6 dps", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Noelle.png" },
      { id: "mika", name: "Mika", element: "Cryo", weapon: "Polearm", rarity: 4, region: "Mondstadt", role: "Support", description: "Mercenary", lore: "Task Captain", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Favonius"], buildPriority: "ER, HP%, ATK%", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Mika.png" },
      { id: "rosaria", name: "Rosaria", element: "Cryo", weapon: "Polearm", rarity: 4, region: "Mondstadt", role: "Sub-DPS", description: "Nun", lore: "Church Member", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Sac Spear"], buildPriority: "ER, ATK%, Crit", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Rosaria.png" },
      { id: "razor", name: "Razor", element: "Electro", weapon: "Claymore", rarity: 4, region: "Mondstadt", role: "DPS", description: "Wolf Boy", lore: "Wolf Guardian", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Pale Flame"], recommendedWeapons: ["Archaic"], buildPriority: "ATK%, Electro DMG, Crit", constellations: "C6 burst", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Razor.png" },
      { id: "lisa", name: "Lisa", element: "Electro", weapon: "Catalyst", rarity: 4, region: "Mondstadt", role: "Sub-DPS", description: "Librarian", lore: "Library Guard", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Thrilling"], buildPriority: "ER, ATK%, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Lisa.png" },
      { id: "kaeya", name: "Kaeya", element: "Cryo", weapon: "Sword", rarity: 4, region: "Mondstadt", role: "Sub-DPS", description: "Cavalry Captain", lore: "Cavalry Member", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Blizzard"], recommendedWeapons: ["Sacrificial"], buildPriority: "ER, ATK%, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Kaeya.png" },
      { id: "aloy", name: "Aloy", element: "Cryo", weapon: "Bow", rarity: 5, region: "Snezhnaya", role: "Sub-DPS", description: "Outlander", lore: "Time Traveler", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Blizzard"], recommendedWeapons: ["Prototype"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "Limited", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Aloy.png" },
      { id: "qiqi", name: "Qiqi", element: "Cryo", weapon: "Sword", rarity: 5, region: "Liyue", role: "Healer", description: "Zombie", lore: "Undead Girl", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Tenacity"], recommendedWeapons: ["Sac Sword"], buildPriority: "ATK%, Healing, ER", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Qiqi.png" },
      { id: "shenhe", name: "Shenhe", element: "Cryo", weapon: "Polearm", rarity: 5, region: "Liyue", role: "Support", description: "Adeptus", lore: "Cloud Retainer", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Favonius"], buildPriority: "ATK%, ER, Cryo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Shenhe.png" },
      { id: "chongyun", name: "Chongyun", element: "Cryo", weapon: "Claymore", rarity: 4, region: "Liyue", role: "Sub-DPS", description: "Exorcist", lore: "Ghost Hunter", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Archaic"], buildPriority: "ER, ATK%, Cryo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Chongyun.png" },
      { id: "tartaglia", name: "Tartaglia", element: "Hydro", weapon: "Bow", rarity: 5, region: "Snezhnaya", role: "DPS", description: "Fatui Harbinger", lore: "Childe", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Heart of Depth"], recommendedWeapons: ["Polar Star"], buildPriority: "ATK%, Hydro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Tartaglia.png" },
      { id: "ayato", name: "Kamisato Ayato", element: "Hydro", weapon: "Sword", rarity: 5, region: "Inazuma", role: "DPS", description: "Clan Head", lore: "Kamisato Leader", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Heart"], recommendedWeapons: ["Splendor"], buildPriority: "ATK%, Hydro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Ayato.png" },
      { id: "sayu", name: "Sayu", element: "Anemo", weapon: "Claymore", rarity: 4, region: "Inazuma", role: "Support", description: "Ninja", lore: "Komore Agent", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Viridescent"], recommendedWeapons: ["Sac Greatsword"], buildPriority: "EM, ER, ATK%", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Sayu.png" },
      { id: "yoimiya", name: "Yoimiya", element: "Pyro", weapon: "Bow", rarity: 5, region: "Inazuma", role: "DPS", description: "Fireworks Master", lore: "Naganohara Owner", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Shimenawa"], recommendedWeapons: ["Rust"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Yoimiya.png" },
      { id: "yae-miko", name: "Yae Miko", element: "Electro", weapon: "Catalyst", rarity: 5, region: "Inazuma", role: "Sub-DPS", description: "Shrine Maiden", lore: "Kitsune", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Lost Prayer"], buildPriority: "ER, ATK%, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_YaeMiko.png" },
      { id: "kujou-sara", name: "Kujou Sara", element: "Electro", weapon: "Bow", rarity: 4, region: "Inazuma", role: "Support", description: "Tenryou General", lore: "Shogun General", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Sac Bow"], buildPriority: "ER, ATK%, Crit", constellations: "C6 dps", imageUrl: "https://enka.network/ui/UI_AvatarIcon_KujouSara.png" },
      { id: "thoma", name: "Thoma", element: "Pyro", weapon: "Polearm", rarity: 4, region: "Inazuma", role: "Support", description: "Housekeeper", lore: "Kamisato Servant", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Favonius"], buildPriority: "ER, HP%, ATK%", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Thoma.png" },
      { id: "gorou", name: "Gorou", element: "Geo", weapon: "Bow", rarity: 4, region: "Inazuma", role: "Support", description: "Sergeant", lore: "Dog General", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Sac Bow"], buildPriority: "ER, DEF%, Crit", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Gorou.png" },
      { id: "collei", name: "Collei", element: "Dendro", weapon: "Bow", rarity: 4, region: "Sumeru", role: "Support", description: "Ranger", lore: "Flame Mane", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["Sac Bow"], buildPriority: "EM, ER, ATK%", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Collei.png" },
      { id: "baizhu", name: "Baizhu", element: "Dendro", weapon: "Catalyst", rarity: 5, region: "Sumeru", role: "Support", description: "Pharmacist", lore: "Medicine Master", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["Prototype"], buildPriority: "ER, ATK%, Dendro DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Baizhu.png" },
      { id: "layla", name: "Layla", element: "Cryo", weapon: "Sword", rarity: 4, region: "Fontaine", role: "Support", description: "Scholar", lore: "Observatory Worker", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Tenacity"], recommendedWeapons: ["Sac Sword"], buildPriority: "ER, HP%, Cryo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Layla.png" },
      { id: "lynette", name: "Lynette", element: "Hydro", weapon: "Bow", rarity: 4, region: "Fontaine", role: "Support", description: "Magician", lore: "Street Performer", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Sac Bow"], buildPriority: "ER, ATK%, Hydro DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Lynette.png" },
      { id: "freminet", name: "Freminet", element: "Cryo", weapon: "Claymore", rarity: 4, region: "Fontaine", role: "DPS", description: "Diver", lore: "Deep Sea Explorer", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Blizzard"], recommendedWeapons: ["Archaic"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Freminet.png" },
      { id: "charlotte", name: "Charlotte", element: "Cryo", weapon: "Catalyst", rarity: 4, region: "Fontaine", role: "Support", description: "Journalist", lore: "Newspaper Worker", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["Prototype"], buildPriority: "ER, ATK%, Cryo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Charlotte.png" },
      { id: "navia", name: "Navia", element: "Geo", weapon: "Claymore", rarity: 5, region: "Fontaine", role: "DPS", description: "Detective", lore: "Investigator Chief", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Wrought"], buildPriority: "ATK%, Geo DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Navia.png" },
      { id: "neuvillette", name: "Neuvillette", element: "Hydro", weapon: "Catalyst", rarity: 5, region: "Fontaine", role: "DPS", description: "Iudex", lore: "Chief Judge", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Heart"], recommendedWeapons: ["Splendor"], buildPriority: "ATK%, Hydro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Neuvillette.png" },
      { id: "wriothesley", name: "Wriothesley", element: "Cryo", weapon: "Catalyst", rarity: 5, region: "Fontaine", role: "DPS", description: "Duke", lore: "Prison Duke", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Blizzard"], recommendedWeapons: ["Prototype"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Wriothesley.png" },
      { id: "ningguang", name: "Ningguang", element: "Geo", weapon: "Catalyst", rarity: 4, region: "Liyue", role: "DPS", description: "Qixing Jade", lore: "Jade Chamber Owner", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Lost"], buildPriority: "ATK%, Geo DMG, Crit", constellations: "C6 dps", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Ningguang.png" },
      { id: "yanfei", name: "Yanfei", element: "Pyro", weapon: "Catalyst", rarity: 4, region: "Liyue", role: "DPS", description: "Attorney", lore: "Half Adeptus", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Crimson"], recommendedWeapons: ["Lost"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Yanfei.png" },
      { id: "yun-jin", name: "Yun Jin", element: "Geo", weapon: "Polearm", rarity: 4, region: "Liyue", role: "Support", description: "Opera Performer", lore: "Actress", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Favonius"], buildPriority: "DEF%, ER, ATK%", constellations: "C6 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_YunJin.png" },
      { id: "klee", name: "Klee", element: "Pyro", weapon: "Catalyst", rarity: 5, region: "Mondstadt", role: "DPS", description: "Bomb Expert", lore: "Elf Girl", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Crimson"], recommendedWeapons: ["Lost"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Klee.png" },
      { id: "albedo", name: "Albedo", element: "Geo", weapon: "Sword", rarity: 5, region: "Mondstadt", role: "Sub-DPS", description: "Alchemist", lore: "Chief Alchemist", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Summit Shaper"], buildPriority: "DEF%, Geo DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Albedo.png" },
      { id: "eula", name: "Eula", element: "Cryo", weapon: "Claymore", rarity: 5, region: "Mondstadt", role: "DPS", description: "Spindrift Knight", lore: "Aristocrat", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Pale Flame"], recommendedWeapons: ["Polar Star"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Eula.png" },
      { id: "varka", name: "Varka", element: "Cryo", weapon: "Claymore", rarity: 5, region: "Mondstadt", role: "DPS", description: "Knight Commander", lore: "Army Leader", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Pale Flame"], recommendedWeapons: ["Archaic"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "Limited", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Varka.png" },
      { id: "dainsleif", name: "Dainsleif", element: "Cryo", weapon: "Sword", rarity: 5, region: "Mondstadt", role: "DPS", description: "Bough Keeper", lore: "Abyss Order", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Blizzard"], recommendedWeapons: ["Mistsplitter"], buildPriority: "ATK%, Cryo DMG, Crit", constellations: "Limited", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Dainsleif.png" },
      { id: "xilonen", name: "Xilonen", element: "Geo", weapon: "Claymore", rarity: 5, region: "Natlan", role: "Support", description: "Warrior", lore: "Natlan Fighter", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Archaic"], buildPriority: "DEF%, Geo DMG, ER", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Xilonen.png" },
      { id: "capitano", name: "Capitano", element: "Pyro", weapon: "Claymore", rarity: 5, region: "Snezhnaya", role: "DPS", description: "Fatui Boss", lore: "Il Capitano", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Crimson"], recommendedWeapons: ["Archaic"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "Limited", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Capitano.png" },
      { id: "citlali", name: "Citlali", element: "Cryo", weapon: "Catalyst", rarity: 5, region: "Natlan", role: "Support", description: "Shaman", lore: "Flame-Mane", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Deepwood"], recommendedWeapons: ["Prototype"], buildPriority: "ER, ATK%, Cryo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Citlali.png" },
      { id: "mavuika", name: "Mavuika", element: "Pyro", weapon: "Bow", rarity: 5, region: "Natlan", role: "DPS", description: "War Chief", lore: "Natlan Leader", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Crimson"], recommendedWeapons: ["Polar"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Mavuika.png" },
      { id: "clorinde", name: "Clorinde", element: "Electro", weapon: "Sword", rarity: 5, region: "Fontaine", role: "DPS", description: "Duelist", lore: "Thigh-high Boots", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Mistsplitter"], buildPriority: "ATK%, Electro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Clorinde.png" },
      { id: "chiori", name: "Chiori", element: "Geo", weapon: "Claymore", rarity: 5, region: "Inazuma", role: "DPS", description: "Tailor", lore: "Fashion Designer", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Wrought"], buildPriority: "ATK%, Geo DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Chiori.png" },
      { id: "kazuki", name: "Kazuki", element: "Hydro", weapon: "Sword", rarity: 4, region: "Inazuma", role: "Support", description: "Samurai", lore: "Wanderer", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Emblem"], recommendedWeapons: ["Sac Sword"], buildPriority: "ER, ATK%, Hydro DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Kazuki.png" },
      { id: "paimon", name: "Paimon", element: "Anemo", weapon: "Catalyst", rarity: 4, region: "Mondstadt", role: "Support", description: "Companion", lore: "Emergency Food", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Prototype"], buildPriority: "ER, ATK%, Anemo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Paimon.png" },
      { id: "lupica", name: "Lupica", element: "Pyro", weapon: "Catalyst", rarity: 4, region: "Mondstadt", role: "Sub-DPS", description: "Abyss Mage", lore: "Elemental", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Crimson"], recommendedWeapons: ["Prototype"], buildPriority: "ATK%, Pyro DMG, Crit", constellations: "Limited", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Lupica.png" },
      { id: "timaeus", name: "Timaeus", element: "Cryo", weapon: "Catalyst", rarity: 4, region: "Mondstadt", role: "Support", description: "Alchemist", lore: "Potion Maker", talents: "Prioritize Burst > Skill", recommendedArtifacts: ["Noblesse"], recommendedWeapons: ["Prototype"], buildPriority: "ER, ATK%, Cryo DMG", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Timaeus.png" },
      { id: "scaramouche", name: "Scaramouche", element: "Electro", weapon: "Catalyst", rarity: 5, region: "Snezhnaya", role: "DPS", description: "Wanderer", lore: "Puppet", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Gilded"], recommendedWeapons: ["Lost"], buildPriority: "ATK%, Electro DMG, Crit", constellations: "C1 boost", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Scaramouche.png" },
      { id: "dottore", name: "Dottore", element: "Hydro", weapon: "Catalyst", rarity: 5, region: "Snezhnaya", role: "DPS", description: "Harbinger", lore: "Doctor", talents: "Prioritize Normal Attack > Burst", recommendedArtifacts: ["Heart"], recommendedWeapons: ["Lost"], buildPriority: "ATK%, Hydro DMG, Crit", constellations: "Limited", imageUrl: "https://enka.network/ui/UI_AvatarIcon_Dottore.png" },
    ];

    for (const character of characters) {
      this.characters.set(character.id, character);
    }

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
      }
    ];

    for (const artifact of artifacts) {
      this.artifacts.set(artifact.id, artifact);
    }
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

  async createTeam(team: InsertTeam): Promise<Team> {
    const newTeam: Team = {
      ...team,
      id: randomUUID(),
    };
    this.teams.set(newTeam.id, newTeam);
    return newTeam;
  }

  async deleteTeam(id: string): Promise<void> {
    this.teams.delete(id);
  }
}

export const storage = new MemStorage();
