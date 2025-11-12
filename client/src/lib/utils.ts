import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Element } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getElementColor(element: Element): string {
  const colors: Record<Element, string> = {
    Pyro: "border-element-pyro text-element-pyro",
    Hydro: "border-element-hydro text-element-hydro",
    Cryo: "border-element-cryo text-element-cryo",
    Electro: "border-element-electro text-element-electro",
    Anemo: "border-element-anemo text-element-anemo",
    Geo: "border-element-geo text-element-geo",
    Dendro: "border-element-dendro text-element-dendro",
  };
  return colors[element] || "";
}

export function getElementBgColor(element: Element): string {
  const colors: Record<Element, string> = {
    Pyro: "bg-element-pyro/10 border-element-pyro/30",
    Hydro: "bg-element-hydro/10 border-element-hydro/30",
    Cryo: "bg-element-cryo/10 border-element-cryo/30",
    Electro: "bg-element-electro/10 border-element-electro/30",
    Anemo: "bg-element-anemo/10 border-element-anemo/30",
    Geo: "bg-element-geo/10 border-element-geo/30",
    Dendro: "bg-element-dendro/10 border-element-dendro/30",
  };
  return colors[element] || "";
}

export function getStarDisplay(rarity: 4 | 5): string {
  return "★".repeat(rarity);
}
