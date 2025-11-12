import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Element types in Genshin Impact
export const elements = ["Pyro", "Hydro", "Cryo", "Electro", "Anemo", "Geo", "Dendro"] as const;
export type Element = typeof elements[number];

// Weapon types
export const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"] as const;
export type WeaponType = typeof weaponTypes[number];

// Regions in Teyvat
export const regions = ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan", "Snezhnaya"] as const;
export type Region = typeof regions[number];

// Character roles
export const roles = ["DPS", "Sub-DPS", "Support", "Healer"] as const;
export type Role = typeof roles[number];

// Artifact types
export const artifactTypes = ["Flower", "Feather", "Sands", "Goblet", "Circlet"] as const;
export type ArtifactType = typeof artifactTypes[number];

// Character interface (for in-memory storage)
export interface Character {
  id: string;
  name: string;
  element: Element;
  weapon: WeaponType;
  rarity: 4 | 5;
  region: Region;
  role: Role;
  description: string;
  lore: string;
  talents: string;
  recommendedArtifacts: string[];
  recommendedWeapons: string[];
  buildPriority: string;
  constellations: string;
}

// Artifact set interface
export interface ArtifactSet {
  id: string;
  name: string;
  twoPieceBonus: string;
  fourPieceBonus: string;
  domain: string;
  recommendedFor: string[];
  types: ArtifactType[];
}

// Team composition interface
export interface Team {
  id: string;
  name: string;
  characterIds: string[];
  description: string;
  synergies: string[];
}

// Elemental reaction interface
export interface ElementalReaction {
  name: string;
  elements: [Element, Element];
  effect: string;
  damageType?: "multiplicative" | "additive" | "transformative";
}

// Insert schemas for database (using Zod)
export const insertCharacterSchema = z.object({
  name: z.string().min(1),
  element: z.enum(elements),
  weapon: z.enum(weaponTypes),
  rarity: z.union([z.literal(4), z.literal(5)]),
  region: z.enum(regions),
  role: z.enum(roles),
  description: z.string(),
  lore: z.string(),
  talents: z.string(),
  recommendedArtifacts: z.array(z.string()),
  recommendedWeapons: z.array(z.string()),
  buildPriority: z.string(),
  constellations: z.string(),
});

export const insertArtifactSetSchema = z.object({
  name: z.string().min(1),
  twoPieceBonus: z.string(),
  fourPieceBonus: z.string(),
  domain: z.string(),
  recommendedFor: z.array(z.string()),
  types: z.array(z.enum(artifactTypes)),
});

export const insertTeamSchema = z.object({
  name: z.string().min(1),
  characterIds: z.array(z.string()).min(1).max(4),
  description: z.string(),
  synergies: z.array(z.string()),
});

export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertArtifactSet = z.infer<typeof insertArtifactSetSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

// Elemental reactions data
export const elementalReactions: ElementalReaction[] = [
  { name: "Vaporize", elements: ["Pyro", "Hydro"], effect: "1.5x-2x DMG based on trigger", damageType: "multiplicative" },
  { name: "Melt", elements: ["Pyro", "Cryo"], effect: "1.5x-2x DMG based on trigger", damageType: "multiplicative" },
  { name: "Overloaded", elements: ["Pyro", "Electro"], effect: "Explosion DMG, knockback enemies", damageType: "transformative" },
  { name: "Superconduct", elements: ["Cryo", "Electro"], effect: "Cryo DMG, reduces Physical RES", damageType: "transformative" },
  { name: "Electro-Charged", elements: ["Hydro", "Electro"], effect: "Continuous Electro DMG over time", damageType: "transformative" },
  { name: "Frozen", elements: ["Hydro", "Cryo"], effect: "Immobilizes enemies", damageType: "transformative" },
  { name: "Swirl", elements: ["Anemo", "Pyro"], effect: "Spreads element and deals DMG", damageType: "transformative" },
  { name: "Swirl", elements: ["Anemo", "Hydro"], effect: "Spreads element and deals DMG", damageType: "transformative" },
  { name: "Swirl", elements: ["Anemo", "Cryo"], effect: "Spreads element and deals DMG", damageType: "transformative" },
  { name: "Swirl", elements: ["Anemo", "Electro"], effect: "Spreads element and deals DMG", damageType: "transformative" },
  { name: "Crystallize", elements: ["Geo", "Pyro"], effect: "Creates shield", damageType: "additive" },
  { name: "Crystallize", elements: ["Geo", "Hydro"], effect: "Creates shield", damageType: "additive" },
  { name: "Crystallize", elements: ["Geo", "Cryo"], effect: "Creates shield", damageType: "additive" },
  { name: "Crystallize", elements: ["Geo", "Electro"], effect: "Creates shield", damageType: "additive" },
  { name: "Bloom", elements: ["Hydro", "Dendro"], effect: "Creates Dendro Core", damageType: "transformative" },
  { name: "Burning", elements: ["Pyro", "Dendro"], effect: "Continuous Pyro DMG", damageType: "transformative" },
  { name: "Quicken", elements: ["Electro", "Dendro"], effect: "Enables Aggravate/Spread", damageType: "additive" },
];
