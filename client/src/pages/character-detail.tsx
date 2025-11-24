import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Character } from "@shared/schema";
import { getElementColor, getElementBgColor, getStarDisplay } from "@/lib/utils";

export default function CharacterDetail() {
  const [, params] = useRoute("/characters/:id");
  const characterId = params?.id;

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ["/api/characters", characterId],
    enabled: !!characterId,
  });

  if (isLoading) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Character not found</h1>
          <Link href="/characters">
            <Button variant="outline">Back to Characters</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Link href="/characters">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Button>
        </Link>

        <div className={`relative h-80 rounded-lg mb-12 overflow-hidden border-4 ${getElementBgColor(character.element)}`}>
          <img 
            src={character.imageUrl} 
            alt={character.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="relative h-full flex items-center px-12">
            <div className="max-w-2xl">
              <Badge className={`mb-4 ${getElementColor(character.element)}`} variant="outline">
                {character.element}
              </Badge>
              <h1 className="font-heading font-bold text-5xl md:text-6xl mb-4" data-testid="text-character-name">
                {character.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">{character.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Rarity:</span>
                  <span className="text-yellow-500 text-lg">{getStarDisplay(character.rarity)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Weapon:</span>
                  <span className="font-medium">{character.weapon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="secondary">{character.role}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{character.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1" data-testid="card-quick-stats">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Element</p>
                <Badge className={getElementColor(character.element)} variant="outline" data-testid="badge-element">
                  {character.element}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Weapon Type</p>
                <p className="font-medium" data-testid="text-weapon">{character.weapon}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Primary Role</p>
                <p className="font-medium" data-testid="text-role">{character.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Region</p>
                <p className="font-medium" data-testid="text-region">{character.region}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rarity</p>
                <p className="text-yellow-500 text-xl" data-testid="text-rarity">{getStarDisplay(character.rarity)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <Tabs defaultValue="lore" className="w-full" data-testid="tabs-character-info">
                <TabsList className="w-full grid grid-cols-4" data-testid="tablist-character-info">
                  <TabsTrigger value="lore" data-testid="tab-lore">Lore</TabsTrigger>
                  <TabsTrigger value="build" data-testid="tab-build">Build</TabsTrigger>
                  <TabsTrigger value="talents" data-testid="tab-talents">Talents</TabsTrigger>
                  <TabsTrigger value="constellations" data-testid="tab-constellations">Constellations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lore" className="mt-6" data-testid="content-lore">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Background</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-character-lore">
                        {character.lore}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="build" className="mt-6" data-testid="content-build">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Recommended Artifacts
                      </h3>
                      <div className="flex flex-wrap gap-2" data-testid="list-recommended-artifacts">
                        {character.recommendedArtifacts.map((artifact) => (
                          <Badge key={artifact} variant="secondary" data-testid={`badge-artifact-${artifact.toLowerCase().replace(/\s/g, '-')}`}>
                            {artifact}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Recommended Weapons</h3>
                      <div className="flex flex-wrap gap-2" data-testid="list-recommended-weapons">
                        {character.recommendedWeapons.map((weapon) => (
                          <Badge key={weapon} variant="outline" data-testid={`badge-weapon-${weapon.toLowerCase().replace(/\s/g, '-')}`}>
                            {weapon}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Build Priority</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-build-priority">
                        {character.buildPriority}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="talents" className="mt-6" data-testid="content-talents">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2">Talent Leveling Priority</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-talents">
                      {character.talents}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="constellations" className="mt-6" data-testid="content-constellations">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-2">Constellation Overview</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="text-constellations">
                      {character.constellations}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
