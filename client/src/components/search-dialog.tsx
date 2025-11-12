import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Sparkles, Box } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Character, ArtifactSet } from "@shared/schema";
import { getElementColor } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
    enabled: open,
  });

  const { data: artifacts = [] } = useQuery<ArtifactSet[]>({
    queryKey: ["/api/artifacts"],
    enabled: open,
  });

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredArtifacts = artifacts.filter((art) =>
    art.name.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = filteredCharacters.length > 0 || filteredArtifacts.length > 0;

  const handleSelect = (path: string) => {
    setLocation(path);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" data-testid="dialog-search">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search characters, artifacts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
              data-testid="input-search"
            />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] px-6 pb-6">
          {!query && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Start typing to search...</p>
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No results found for "{query}"</p>
            </div>
          )}

          {query && hasResults && (
            <div className="space-y-6">
              {filteredCharacters.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Characters ({filteredCharacters.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {filteredCharacters.slice(0, 5).map((character) => (
                      <button
                        key={character.id}
                        onClick={() => handleSelect(`/characters/${character.id}`)}
                        className="w-full flex items-center gap-4 p-3 rounded-md hover-elevate active-elevate-2 bg-card border transition-all"
                        data-testid={`result-character-${character.id}`}
                      >
                        <div className="flex-1 text-left">
                          <p className="font-medium">{character.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={getElementColor(character.element)}
                            >
                              {character.element}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {character.weapon} • {character.role}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredArtifacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Box className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Artifacts ({filteredArtifacts.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {filteredArtifacts.slice(0, 5).map((artifact) => (
                      <button
                        key={artifact.id}
                        onClick={() => handleSelect("/artifacts")}
                        className="w-full flex items-center gap-4 p-3 rounded-md hover-elevate active-elevate-2 bg-card border transition-all"
                        data-testid={`result-artifact-${artifact.id}`}
                      >
                        <div className="flex-1 text-left">
                          <p className="font-medium">{artifact.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {artifact.twoPieceBonus}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
