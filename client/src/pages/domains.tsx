import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Calendar, Users, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ArtifactSet } from "@shared/schema";

interface Domain {
  id: string;
  name: string;
  region: string;
  description: string;
  recommendedLevel: number;
  artifactSets: readonly string[];
  weekDays: readonly string[];
  characters: string;
}

const domains: readonly Domain[] = [
  {
    id: "valley_of_remembrance",
    name: "Valley of Remembrance",
    region: "Mondstadt",
    description: "Ancient ruins that hold memories of the past",
    recommendedLevel: 30,
    artifactSets: ["Crimson Witch of Flames", "Thundersoother"],
    weekDays: ["Monday", "Thursday"],
    characters: "Hu Tao, Alhaitham, Fischl",
  },
  {
    id: "domain_of_guyun",
    name: "Domain of Guyun",
    region: "Liyue",
    description: "Remains of a sunken island, guarded by ancient guardians",
    recommendedLevel: 45,
    artifactSets: ["Archaic Petra", "Retracing Bolide"],
    weekDays: ["Tuesday", "Friday"],
    characters: "Zhongli, Albedo, Alhaitham",
  },
  {
    id: "shrine_of_depths",
    name: "Shrine of Depths",
    region: "Inazuma",
    description: "A sacred Inazuman shrine with electro energy",
    recommendedLevel: 45,
    artifactSets: ["Emblem of Severed Fate", "Shimenawa's Reminiscence"],
    weekDays: ["Wednesday", "Saturday"],
    characters: "Raiden Shogun, Kokomi, Fischl",
  },
  {
    id: "spire_of_solitary_heroism",
    name: "Spire of Solitary Heroism",
    region: "Sumeru",
    description: "Tower of ancient dendro civilization",
    recommendedLevel: 50,
    artifactSets: ["Gilded Dreams", "Desert Pavilion Chronicle"],
    weekDays: ["Thursday", "Sunday"],
    characters: "Nahida, Alhaitham, Tighnari",
  },
  {
    id: "court_of_flowing_sand",
    name: "Court of Flowing Sand",
    region: "Sumeru",
    description: "Ancient palace hidden in the desert",
    recommendedLevel: 50,
    artifactSets: ["Husk of Opulent Dreams", "Ocean-Hued Clam"],
    weekDays: ["Tuesday", "Friday"],
    characters: "Kokomi, Nilou, Barbara",
  },
  {
    id: "taishan_mansion",
    name: "Taishan Mansion",
    region: "Liyue",
    description: "Residence of immortals with earthly treasures",
    recommendedLevel: 45,
    artifactSets: ["Tenacity of the Millelith", "Pale Flame"],
    weekDays: ["Wednesday", "Saturday"],
    characters: "Zhongli, Albedo, Hu Tao",
  },
  {
    id: "momiji_dyed_court",
    name: "Momiji-Dyed Court",
    region: "Inazuma",
    description: "Autumn-touched court with sacred trees",
    recommendedLevel: 45,
    artifactSets: ["Echoing Deepness", "Nighttime Whispers"],
    weekDays: ["Monday", "Thursday"],
    characters: "Nahida, Kokomi, Ayaka",
  },
  {
    id: "slumbering_court",
    name: "Slumbering Court",
    region: "Fontaine",
    description: "Submerged court with mysterious hydro energy",
    recommendedLevel: 50,
    artifactSets: ["Marechaussee Hunter", "Golden Troupe"],
    weekDays: ["Tuesday", "Friday"],
    characters: "Navia, Furina, Charlotte",
  },
];

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Domains() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { data: artifactSets = [] } = useQuery<ArtifactSet[]>({
    queryKey: ["/api/artifacts"],
  });

  const filteredDomains = selectedDay
    ? domains.filter((domain) => domain.weekDays.includes(selectedDay))
    : Array.from(domains);

  const sortedDomains = [...filteredDomains].sort((a, b) => {
    if (selectedDay) {
      const aIndex = Array.from(a.weekDays).indexOf(selectedDay);
      const bIndex = Array.from(b.weekDays).indexOf(selectedDay);
      return aIndex - bIndex;
    }
    return a.region.localeCompare(b.region);
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Domain Finder</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-12 max-w-3xl">
          Find artifact farming domains across Teyvat. Filter by weekday to see which domains are available and plan your farming schedule.
        </p>

        {/* Day Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">Filter by Day</h2>
            {selectedDay && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="ml-auto"
                data-testid="button-clear-day-filter"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {dayOrder.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                className="font-medium"
                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                data-testid={`button-filter-day-${day.toLowerCase()}`}
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>

        {/* Domains Grid */}
        {sortedDomains.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="grid-domains">
            {sortedDomains.map((domain) => (
              <Card key={domain.id} className="hover-elevate active-elevate-2 transition-all" data-testid={`card-domain-${domain.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{domain.name}</CardTitle>
                      <CardDescription>{domain.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      Lv. {domain.recommendedLevel}+
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Region */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Region</p>
                      <p className="text-sm">{domain.region}</p>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Available Days</p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(domain.weekDays).map((day) => (
                          <Badge
                            key={day}
                            variant="secondary"
                            className={selectedDay === day ? "bg-primary text-primary-foreground" : ""}
                          >
                            {day.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Artifact Sets */}
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Artifact Sets</p>
                      <div className="space-y-1">
                        {Array.from(domain.artifactSets).map((setName) => {
                          const artifactSet = artifactSets.find((a) => a.name === setName);
                          return (
                            <div key={setName} className="text-sm">
                              <p className="font-medium">{setName}</p>
                              {artifactSet && (
                                <p className="text-xs text-muted-foreground">{artifactSet.twoPieceBonus}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Characters */}
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Recommended for:</p>
                      <p className="text-sm text-muted-foreground">{domain.characters}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">No domains available for {selectedDay}</p>
            <p className="text-sm text-muted-foreground">Try selecting a different day</p>
          </div>
        )}

        {/* Daily Rotation Info */}
        <Card className="mt-12 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Daily Domain Rotation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Artifact domains have a daily rotation schedule. You can farm specific artifact sets on their designated days to optimize your farming routes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Even Domains (Mon, Wed, Fri, Sun)</p>
                <p className="text-muted-foreground">Valley of Remembrance, Domain of Guyun, and more</p>
              </div>
              <div>
                <p className="font-medium mb-2">Odd Domains (Tue, Thu, Sat, Sun)</p>
                <p className="text-muted-foreground">Shrine of Depths, Taishan Mansion, and more</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Note: This is a farming guide. Check in-game for current domain availability and rewards.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
