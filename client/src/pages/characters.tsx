import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Sparkles, Filter, X, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Character, Element, WeaponType, Region } from "@shared/schema";
import { elements, weaponTypes, regions } from "@shared/schema";
import { getElementColor, getElementBgColor, getStarDisplay } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

export default function Characters() {
  const [elementFilter, setElementFilter] = useState<Element | null>(null);
  const [weaponFilter, setWeaponFilter] = useState<WeaponType | null>(null);
  const [regionFilter, setRegionFilter] = useState<Region | null>(null);
  const [rarityFilter, setRarityFilter] = useState<4 | 5 | null>(null);

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { isFavorited, toggleFavorite, favorites } = useFavorites("characters");

  const filteredCharacters = characters.filter((char) => {
    if (elementFilter && char.element !== elementFilter) return false;
    if (weaponFilter && char.weapon !== weaponFilter) return false;
    if (regionFilter && char.region !== regionFilter) return false;
    if (rarityFilter && char.rarity !== rarityFilter) return false;
    return true;
  });

  const hasActiveFilters = elementFilter || weaponFilter || regionFilter || rarityFilter;

  const clearFilters = () => {
    setElementFilter(null);
    setWeaponFilter(null);
    setRegionFilter(null);
    setRarityFilter(null);
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Character Database</h1>
          {favorites.length > 0 && (
            <Link href="/favorites" className="ml-auto">
              <Button variant="outline" size="sm" data-testid="button-view-favorites">
                <Heart className="h-4 w-4 mr-2 fill-current text-red-500" />
                Favorites ({favorites.length})
              </Button>
            </Link>
          )}
        </div>
        <p className="text-muted-foreground text-lg mb-12 max-w-3xl">
          Explore all playable characters in Genshin Impact. Filter by element, weapon type, region, and rarity to find your favorites.
        </p>

        <div className="mb-8 space-y-6">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">Filters</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
                data-testid="button-clear-filters"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Element</h3>
              <div className="flex flex-wrap gap-2">
                {elements.map((element) => (
                  <Button
                    key={element}
                    variant={elementFilter === element ? "default" : "outline"}
                    size="sm"
                    onClick={() => setElementFilter(elementFilter === element ? null : element)}
                    className={elementFilter === element ? "" : getElementColor(element)}
                    data-testid={`filter-element-${element.toLowerCase()}`}
                  >
                    {element}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Weapon</h3>
              <div className="flex flex-wrap gap-2">
                {weaponTypes.map((weapon) => (
                  <Button
                    key={weapon}
                    variant={weaponFilter === weapon ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWeaponFilter(weaponFilter === weapon ? null : weapon)}
                    data-testid={`filter-weapon-${weapon.toLowerCase()}`}
                  >
                    {weapon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Region</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Button
                    key={region}
                    variant={regionFilter === region ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRegionFilter(regionFilter === region ? null : region)}
                    data-testid={`filter-region-${region.toLowerCase()}`}
                  >
                    {region}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Rarity</h3>
              <div className="flex flex-wrap gap-2">
                {[5, 4].map((rarity) => (
                  <Button
                    key={rarity}
                    variant={rarityFilter === rarity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRarityFilter(rarityFilter === rarity ? null : (rarity as 4 | 5))}
                    data-testid={`filter-rarity-${rarity}`}
                  >
                    {getStarDisplay(rarity as 4 | 5)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground" data-testid="text-character-count">
            Showing {filteredCharacters.length} of {characters.length} characters
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-6">
                  <Skeleton className="h-48 w-full mb-4 rounded-md" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No characters found matching your filters</p>
            <Button variant="outline" onClick={clearFilters} data-testid="button-clear-no-results">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <div key={character.id}>
                <Link href={`/characters/${character.id}`}>
                  <Card
                    className={`h-full hover-elevate active-elevate-2 cursor-pointer transition-all group border-2 ${getElementBgColor(character.element)}`}
                    data-testid={`card-character-${character.id}`}
                  >
                    <CardHeader className="p-6">
                      <div className="relative aspect-[3/4] mb-4 rounded-md bg-muted overflow-hidden">
                        <img 
                          src={character.imageUrl} 
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 left-2 h-9 w-9"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(character.id);
                          }}
                          data-testid={`button-favorite-${character.id}`}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isFavorited(character.id)
                                ? "fill-red-500 text-red-500"
                                : "text-white drop-shadow-md"
                            }`}
                          />
                        </Button>
                        <Badge
                          className={`absolute top-2 right-2 ${getElementColor(character.element)}`}
                          variant="outline"
                        >
                          {character.element}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                        {character.name}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">{getStarDisplay(character.rarity)}</span>
                          <span>•</span>
                          <span>{character.weapon}</span>
                        </div>
                        <div className="text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {character.role}
                          </Badge>
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
