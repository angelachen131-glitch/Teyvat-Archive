import { useQuery } from "@tanstack/react-query";
import { Box, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ArtifactSet } from "@shared/schema";

export default function Artifacts() {
  const { data: artifacts = [], isLoading } = useQuery<ArtifactSet[]>({
    queryKey: ["/api/artifacts"],
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Box className="h-8 w-8 text-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Artifact Sets</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-12 max-w-3xl">
          Discover all artifact sets in Genshin Impact, their set bonuses, and the best characters to use them with.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-artifacts-loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-artifacts">
            {artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="hover-elevate active-elevate-2 transition-all"
                data-testid={`card-artifact-${artifact.id}`}
              >
                <CardHeader className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-md bg-primary/10 border border-primary/20 overflow-hidden flex-shrink-0">
                      <img 
                        src={artifact.imageUrl} 
                        alt={artifact.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full"><Box className="h-6 w-6 text-primary" /></div>';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{artifact.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {artifact.domain}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-0 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-primary mb-2">2-Piece Bonus</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {artifact.twoPieceBonus}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-primary mb-2">4-Piece Bonus</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {artifact.fourPieceBonus}
                      </p>
                    </div>

                    {artifact.recommendedFor.length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="recommended" className="border-none">
                          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2" data-testid={`accordion-recommended-${artifact.id}`}>
                            <span className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              Recommended For ({artifact.recommendedFor.length})
                            </span>
                          </AccordionTrigger>
                          <AccordionContent data-testid={`content-recommended-${artifact.id}`}>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {artifact.recommendedFor.map((char) => (
                                <Badge key={char} variant="secondary" className="text-xs" data-testid={`badge-char-${char.toLowerCase().replace(/\s/g, '-')}`}>
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && artifacts.length === 0 && (
          <div className="text-center py-16">
            <Box className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">No artifact sets available</p>
          </div>
        )}
      </div>
    </div>
  );
}
