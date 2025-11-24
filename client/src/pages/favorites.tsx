import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Character } from "@shared/schema";
import { useFavorites } from "@/hooks/use-favorites";
import { getElementColor, getElementBgColor, getStarDisplay } from "@/lib/utils";

export default function Favorites() {
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { favorites, isFavorited, removeFavorite } = useFavorites("characters");

  const favoriteCharacters = characters.filter((char) => isFavorited(char.id));

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Link href="/characters">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Favorite Characters</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-12 max-w-3xl">
          Your personalized collection of favorite characters for quick reference and team building.
        </p>

        {!favorites || favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground mb-4">No favorites yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add characters to your favorites by clicking the heart icon on character cards
            </p>
            <Link href="/characters">
              <Button variant="outline">Browse Characters</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-favorite-characters">
            {favoriteCharacters.map((character) => (
              <div key={character.id}>
                <Link href={`/characters/${character.id}`}>
                  <Card
                    className={`h-full hover-elevate active-elevate-2 cursor-pointer transition-all group border-2 ${getElementBgColor(
                      character.element
                    )}`}
                    data-testid={`card-character-${character.id}`}
                  >
                    <CardHeader className="p-6">
                      <div className="relative aspect-[3/4] mb-4 rounded-md bg-muted overflow-hidden">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(character.id)}
                  className="w-full mt-2 text-destructive hover:text-destructive"
                  data-testid={`button-remove-favorite-${character.id}`}
                >
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  Remove from Favorites
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
