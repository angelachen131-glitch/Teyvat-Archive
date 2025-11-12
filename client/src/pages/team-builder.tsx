import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Swords, Plus, X, Zap } from "lucide-react";
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
