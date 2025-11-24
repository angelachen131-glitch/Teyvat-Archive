import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus, X, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Character, ArtifactSet } from "@shared/schema";
import { getElementColor, getStarDisplay } from "@/lib/utils";

interface Build {
  id: string;
  characterId: string;
  characterName: string;
  artifactSets: string[];
  weapons: string[];
  mainStats: string;
  subStats: string;
  priority: string;
}

const sampleBuilds: Build[] = [
  {
    id: "build-1",
    characterId: "hu_tao",
    characterName: "Hu Tao",
    artifactSets: ["Crimson Witch of Flames"],
    weapons: ["Staff of Homa", "Dragon's Bane"],
    mainStats: "HP% / Pyro DMG / Crit Rate",
    subStats: "Crit DMG, ATK%, Energy Recharge",
    priority: "Crit Rate > Crit DMG > HP%",
  },
  {
    id: "build-2",
    characterId: "nahida",
    characterName: "Nahida",
    artifactSets: ["Gilded Dreams", "Deepwood Memories"],
    weapons: ["A Thousand Floating Dreams", "Magic Guide"],
    mainStats: "EM / Dendro DMG / EM",
    subStats: "EM, Crit Rate, Crit DMG",
    priority: "EM > Crit Rate = Crit DMG",
  },
  {
    id: "build-3",
    characterId: "kokomi",
    characterName: "Kokomi",
    artifactSets: ["Ocean-Hued Clam"],
    weapons: ["Thrilling Tales", "Prototype Amber"],
    mainStats: "HP% / Hydro DMG / Healing Bonus",
    subStats: "HP%, Energy Recharge",
    priority: "HP% > Energy Recharge > Healing Bonus",
  },
  {
    id: "build-4",
    characterId: "fischl",
    characterName: "Fischl",
    artifactSets: ["Emblem of Severed Fate"],
    weapons: ["Aqua Simulacra", "The Stringless"],
    mainStats: "ATK% / Electro DMG / Crit Rate",
    subStats: "Crit DMG, ATK%, Energy Recharge",
    priority: "Energy Recharge > Crit Rate > Crit DMG",
  },
  {
    id: "build-5",
    characterId: "zhongli",
    characterName: "Zhongli",
    artifactSets: ["Tenacity of the Millelith"],
    weapons: ["Favonius Lance", "Black Tassel"],
    mainStats: "HP% / Geo DMG / HP%",
    subStats: "HP%, Energy Recharge",
    priority: "HP% > Energy Recharge",
  },
];

export default function BuildComparison() {
  const [selectedBuilds, setSelectedBuilds] = useState<Build[]>([]);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { data: artifacts = [] } = useQuery<ArtifactSet[]>({
    queryKey: ["/api/artifacts"],
  });

  const addBuild = (build: Build) => {
    if (selectedBuilds.length < 3 && !selectedBuilds.find((b) => b.id === build.id)) {
      setSelectedBuilds([...selectedBuilds, build]);
      setIsSelectDialogOpen(false);
    }
  };

  const removeBuild = (buildId: string) => {
    setSelectedBuilds(selectedBuilds.filter((b) => b.id !== buildId));
  };

  const getArtifactDetails = (setName: string) => {
    return artifacts.find((a) => a.name === setName);
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <Link href="/characters">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Build Comparison</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-12 max-w-3xl">
          Compare different artifact and weapon combinations to find the best build for your playstyle.
        </p>

        {selectedBuilds.length === 0 ? (
          <div className="text-center py-16">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground mb-4">No builds selected</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add up to 3 builds to compare their stats and requirements
            </p>
            <Button onClick={() => setIsSelectDialogOpen(true)} data-testid="button-add-first-build">
              <Plus className="h-4 w-4 mr-2" />
              Add Build
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-comparison-builds">
              {selectedBuilds.map((build) => (
                <Card key={build.id} className="relative" data-testid={`card-build-${build.id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 z-10"
                    onClick={() => removeBuild(build.id)}
                    data-testid={`button-remove-build-${build.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle className="text-lg mb-2">{build.characterName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Artifact Sets */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Artifact Set</p>
                      <div className="space-y-2">
                        {build.artifactSets.map((setName) => {
                          const artifactSet = getArtifactDetails(setName);
                          return (
                            <div key={setName} className="p-2 rounded-md bg-muted/50">
                              <p className="font-medium text-sm">{setName}</p>
                              {artifactSet && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  4pc: {artifactSet.fourPieceBonus}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Weapons */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Recommended Weapons</p>
                      <div className="flex flex-wrap gap-1">
                        {build.weapons.map((weapon) => (
                          <Badge key={weapon} variant="secondary" className="text-xs">
                            {weapon}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Main Stats */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Main Stats</p>
                      <p className="text-sm">{build.mainStats}</p>
                    </div>

                    {/* Sub Stats */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Sub Stats Priority</p>
                      <p className="text-sm">{build.subStats}</p>
                    </div>

                    {/* Priority */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Stat Priority</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{build.priority}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add Build Button */}
              {selectedBuilds.length < 3 && (
                <Card
                  className="border-2 border-dashed hover-elevate active-elevate-2 cursor-pointer transition-all flex items-center justify-center min-h-[400px]"
                  onClick={() => setIsSelectDialogOpen(true)}
                  data-testid="card-add-build"
                >
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Add Build to Compare</p>
                  </div>
                </Card>
              )}
            </div>

            {/* Comparison Summary */}
            {selectedBuilds.length > 1 && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle>Comparison Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Build Flexibility</p>
                      <p className="text-sm">
                        Different builds suit different playstyles. DPS builds prioritize Crit stats, while Support builds focus on Energy
                        Recharge and utility.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Farming Guide</p>
                      <p className="text-sm">
                        Visit the Domain Finder to locate where you can farm the required artifact sets for your chosen builds.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Select Dialog */}
        <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]" data-testid="dialog-select-build">
            <DialogHeader>
              <DialogTitle data-testid="title-select-build">Select a Build to Compare</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" data-testid="scroll-build-list">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleBuilds
                  .filter((build) => !selectedBuilds.find((b) => b.id === build.id))
                  .map((build) => (
                    <Card
                      key={build.id}
                      className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                      onClick={() => addBuild(build)}
                      data-testid={`select-build-${build.id}`}
                    >
                      <CardHeader>
                        <CardTitle className="text-base">{build.characterName}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{build.artifactSets.join(", ")}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          {build.weapons.map((weapon) => (
                            <Badge key={weapon} variant="secondary" className="text-xs">
                              {weapon.split(" ")[0]}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
