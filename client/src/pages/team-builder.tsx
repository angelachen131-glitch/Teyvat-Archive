import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swords, Plus, X, Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Character, Element } from "@shared/schema";
import { elementalReactions } from "@shared/schema";
import { getElementColor, getElementBgColor, getStarDisplay } from "@/lib/utils";

export default function TeamBuilder() {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false);

  const { data: allCharacters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const availableCharacters = allCharacters.filter(
    (char) => !selectedCharacters.find((sc) => sc.id === char.id)
  );

  const addCharacter = (character: Character) => {
    if (selectedCharacters.length < 4) {
      setSelectedCharacters([...selectedCharacters, character]);
      setIsSelectDialogOpen(false);
    }
  };

  const removeCharacter = (characterId: string) => {
    setSelectedCharacters(selectedCharacters.filter((c) => c.id !== characterId));
  };

  const getTeamReactions = () => {
    if (selectedCharacters.length < 2) return [];

    const elements = selectedCharacters.map((c) => c.element);
    const uniqueElements = Array.from(new Set(elements));
    
    const reactions: typeof elementalReactions = [];
    
    uniqueElements.forEach((element1) => {
      uniqueElements.forEach((element2) => {
        if (element1 !== element2) {
          const reaction = elementalReactions.find(
            (r) =>
              (r.elements[0] === element1 && r.elements[1] === element2) ||
              (r.elements[0] === element2 && r.elements[1] === element1)
          );
          if (reaction && !reactions.find((r) => r.name === reaction.name && r.elements.join() === reaction.elements.join())) {
            reactions.push(reaction);
          }
        }
      });
    });

    return reactions;
  };

  const reactions = getTeamReactions();

  const getTeamSynergyAnalysis = () => {
    if (selectedCharacters.length === 0) {
      return { coverage: 0, roleBalance: [], warnings: [], recommendations: [] };
    }

    const elements = selectedCharacters.map((c) => c.element);
    const roles = selectedCharacters.map((c) => c.role);
    const uniqueElements = new Set(elements).size;
    
    // Calculate element coverage (1-5 scale)
    const coverage = Math.min(5, uniqueElements);

    // Check role balance
    const roleCounts = roles.reduce(
      (acc, role) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const roleBalance = Object.entries(roleCounts).map(([role, count]) => ({ role, count }));

    // Generate recommendations
    const warnings: string[] = [];
    const recommendations: string[] = [];

    const hasDPS = roles.includes("DPS") || roles.includes("Sub-DPS");
    const hasHealer = roles.includes("Healer");
    const hasSupport = roles.includes("Support");

    if (!hasDPS) {
      warnings.push("Team lacks a DPS character for damage output");
    }
    if (!hasHealer && selectedCharacters.length >= 3) {
      recommendations.push("Consider adding a Healer for survivability");
    }
    if (!hasSupport && selectedCharacters.length >= 3) {
      recommendations.push("A Support character can enhance team damage");
    }

    if (uniqueElements === 1) {
      recommendations.push("Team is mono-element. Add different elements for reactions");
    } else if (coverage >= 3) {
      recommendations.push("Good elemental diversity for consistent reactions");
    }

    return { coverage, roleBalance, warnings, recommendations };
  };

  const synergy = getTeamSynergyAnalysis();

  const getCharacterPairSynergy = (char1: Character, char2: Character): string | null => {
    // Check if they trigger good reactions
    const hasReaction = reactions.some(
      (r) =>
        (r.elements[0] === char1.element && r.elements[1] === char2.element) ||
        (r.elements[0] === char2.element && r.elements[1] === char1.element)
    );

    // Check role synergy
    const roleCombo = `${char1.role}-${char2.role}`;
    const goodCombos = ["DPS-Support", "DPS-Sub-DPS", "DPS-Healer", "Sub-DPS-Support"];
    const hasRoleSynergy = goodCombos.some(
      (combo) => roleCombo === combo || roleCombo === combo.split("-").reverse().join("-")
    );

    if (hasReaction && hasRoleSynergy) return "Excellent";
    if (hasReaction || hasRoleSynergy) return "Good";
    return null;
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Swords className="h-8 w-8 text-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Team Builder</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-12">
          Build your perfect team composition. Select up to 4 characters and discover their elemental synergies.
        </p>

        <div className="space-y-8">
          <Card data-testid="card-team-composition">
            <CardHeader>
              <CardTitle data-testid="text-team-count">Team Composition ({selectedCharacters.length}/4)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => {
                  const character = selectedCharacters[index];
                  return (
                    <div key={index}>
                      {character ? (
                        <Card
                          className={`relative border-2 ${getElementBgColor(character.element)}`}
                          data-testid={`slot-character-${index}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 z-10"
                            onClick={() => removeCharacter(character.id)}
                            data-testid={`button-remove-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <CardHeader className="p-4">
                            <div className="aspect-square rounded-md bg-muted mb-3 flex items-center justify-center">
                              <Badge className={getElementColor(character.element)} variant="outline">
                                {character.element}
                              </Badge>
                            </div>
                            <CardTitle className="text-sm">{character.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {getStarDisplay(character.rarity)} • {character.role}
                            </p>
                          </CardHeader>
                        </Card>
                      ) : (
                        <Card
                          className="h-full border-2 border-dashed hover-elevate active-elevate-2 cursor-pointer transition-all"
                          onClick={() => setIsSelectDialogOpen(true)}
                          data-testid={`slot-empty-${index}`}
                        >
                          <CardContent className="flex items-center justify-center min-h-[200px]">
                            <div className="text-center">
                              <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Add Character</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {selectedCharacters.length > 1 && (
            <Card data-testid="card-synergy-analysis">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Team Synergy Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Element Coverage */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-semibold">Element Coverage</h4>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-6 rounded-full ${
                            i < synergy.coverage ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {synergy.coverage}/5 unique elements in your team
                  </p>
                </div>

                {/* Role Balance */}
                <div>
                  <h4 className="font-semibold mb-3">Role Distribution</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["DPS", "Sub-DPS", "Support", "Healer"].map((role) => {
                      const count = synergy.roleBalance.find((r) => r.role === role)?.count || 0;
                      return (
                        <div key={role} className="p-2 rounded-md bg-muted text-center">
                          <p className="text-xs font-medium text-muted-foreground">{role}</p>
                          <p className="text-lg font-bold">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Character Pair Synergies */}
                {selectedCharacters.length >= 2 && (
                  <div>
                    <h4 className="font-semibold mb-3">Character Pair Synergies</h4>
                    <div className="space-y-2">
                      {selectedCharacters.map((char1, i1) =>
                        selectedCharacters.map((char2, i2) => {
                          if (i1 >= i2) return null;
                          const synergy_level = getCharacterPairSynergy(char1, char2);
                          return synergy_level ? (
                            <div key={`${i1}-${i2}`} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                              <div className="flex-1 text-sm">
                                <span className="font-medium">{char1.name}</span>
                                <span className="text-muted-foreground"> + </span>
                                <span className="font-medium">{char2.name}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  synergy_level === "Excellent"
                                    ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50"
                                    : "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/50"
                                }
                              >
                                {synergy_level}
                              </Badge>
                            </div>
                          ) : null;
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {synergy.warnings.length > 0 && (
                  <div className="space-y-2">
                    {synergy.warnings.map((warning, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {synergy.recommendations.length > 0 && (
                  <div className="space-y-2">
                    {synergy.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-md bg-blue-500/10 border border-blue-500/30">
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-400">{rec}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {reactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Elemental Reactions ({reactions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reactions.map((reaction, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-md bg-muted/50 border"
                      data-testid={`reaction-${index}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{reaction.name}</h4>
                        {reaction.damageType && (
                          <Badge variant="outline" className="text-xs">
                            {reaction.damageType}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getElementColor(reaction.elements[0])}>
                          {reaction.elements[0]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">+</span>
                        <Badge variant="outline" className={getElementColor(reaction.elements[1])}>
                          {reaction.elements[1]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{reaction.effect}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedCharacters.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Swords className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Start building your team</p>
              <p className="text-sm">Click on any slot above to add a character</p>
            </div>
          )}
        </div>

        <Dialog open={isSelectDialogOpen} onOpenChange={setIsSelectDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]" data-testid="dialog-select-character">
            <DialogHeader>
              <DialogTitle data-testid="title-select-character">Select a Character</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" data-testid="scroll-character-list">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableCharacters.map((character) => (
                  <Card
                    key={character.id}
                    className={`cursor-pointer hover-elevate active-elevate-2 transition-all border-2 ${getElementBgColor(character.element)}`}
                    onClick={() => addCharacter(character)}
                    data-testid={`select-character-${character.id}`}
                  >
                    <CardHeader className="p-4">
                      <div className="aspect-square rounded-md bg-muted mb-3 flex items-center justify-center">
                        <Badge className={getElementColor(character.element)} variant="outline">
                          {character.element}
                        </Badge>
                      </div>
                      <CardTitle className="text-base">{character.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {getStarDisplay(character.rarity)} • {character.weapon}
                      </p>
                    </CardHeader>
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
