import { BookOpen, Star, Coins, Map, Users, Sword, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BeginnersGuide() {
  const guideSections = [
    {
      icon: Star,
      title: "Adventure Rank Progression",
      description: "Understanding the Adventure Rank system",
      tips: [
        "Complete daily commissions every day for consistent AR experience",
        "Don't rush to increase your World Level - make sure your characters are properly leveled",
        "Use Original Resin wisely on Ley Lines, Domains, and Bosses",
        "Explore the world thoroughly to unlock waypoints and find treasure chests",
      ],
    },
    {
      icon: Users,
      title: "Character Leveling",
      description: "How to effectively level up your characters",
      tips: [
        "Focus on leveling 1-2 main DPS characters first before spreading resources",
        "Character level should match or be close to your World Level",
        "Don't neglect support characters - level them to 60/70 for the second passive talent",
        "Prioritize leveling talents on your main DPS characters",
        "Farm character ascension materials in advance when possible",
      ],
    },
    {
      icon: Sword,
      title: "Weapon Enhancement",
      description: "Upgrading and selecting the right weapons",
      tips: [
        "Match weapon types to your character's playstyle and team role",
        "Refining 3-star weapons can be very cost-effective for F2P players",
        "Save enhancement ores for 4-star and 5-star weapons",
        "Consider weapon passive abilities, not just base ATK",
        "Weapon level should generally match your character level",
      ],
    },
    {
      icon: Coins,
      title: "Resin Management",
      description: "Making the most of your Original Resin",
      tips: [
        "Never let your resin cap at 160 - always use it or condense it",
        "Prioritize weekly bosses for talent materials and billets",
        "Farm artifact domains after AR45 when you can get guaranteed 5-star artifacts",
        "Use condensed resin for domains to save time (up to 5 per day)",
        "Consider using fragile resin only after AR45 for artifact farming",
      ],
    },
    {
      icon: Target,
      title: "Daily Routine",
      description: "Essential daily tasks for progression",
      tips: [
        "Complete all 4 daily commissions for primogems and AR exp",
        "Spend your daily resin on domains, bosses, or ley lines",
        "Check the blacksmith for ore expeditions",
        "Craft condensed resin if you can't spend all your resin",
        "Collect specialty items while exploring for character ascensions",
      ],
    },
    {
      icon: Map,
      title: "Exploration Tips",
      description: "Making the most of your journey through Teyvat",
      tips: [
        "Unlock all waypoints and statues in new regions immediately",
        "Mark ore deposits and specialty plants on your map",
        "Open all chests you find - they provide AR exp and primogems",
        "Complete puzzles and challenges for valuable rewards",
        "Follow the Seelie spirits to find hidden chests",
        "Climb to high points to reveal nearby points of interest",
      ],
    },
  ];

  const starterTeams = [
    {
      name: "Free-to-Play Team",
      characters: ["Traveler (Anemo)", "Kaeya", "Lisa", "Amber"],
      description: "A solid team using only free characters available to all players.",
    },
    {
      name: "Beginner Friendly",
      characters: ["Noelle", "Xiangling", "Barbara", "Fischl"],
      description: "Easy to obtain characters that work well together for early game content.",
    },
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="font-heading font-bold text-4xl md:text-5xl">Beginner's Guide</h1>
        </div>
        <p className="text-muted-foreground text-lg mb-12">
          Essential tips and strategies to help you start your journey in Teyvat. Learn the fundamentals of character progression, resource management, and efficient gameplay.
        </p>

        <div className="space-y-8 mb-16">
          <Accordion type="single" collapsible className="w-full space-y-4" data-testid="accordion-guide-sections">
            {guideSections.map((section, index) => (
              <AccordionItem
                key={index}
                value={`section-${index}`}
                className="border rounded-lg px-6"
                data-testid={`item-${section.title.toLowerCase().replace(/\s/g, '-')}`}
              >
                <AccordionTrigger
                  className="hover:no-underline py-6"
                  data-testid={`trigger-${section.title.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="p-3 rounded-md bg-primary/10 border border-primary/20 mt-1">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6" data-testid={`content-${section.title.toLowerCase().replace(/\s/g, '-')}`}>
                  <ul className="space-y-3 ml-16" data-testid={`list-tips-${section.title.toLowerCase().replace(/\s/g, '-')}`}>
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex gap-3" data-testid={`tip-${index}-${tipIndex}`}>
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <h2 className="font-heading font-bold text-3xl mb-6">Recommended Starter Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {starterTeams.map((team, index) => (
              <Card key={index} data-testid={`card-starter-team-${index}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {team.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {team.characters.map((character, charIndex) => (
                      <div
                        key={charIndex}
                        className="p-3 rounded-md bg-muted/50 border text-sm font-medium"
                      >
                        {character}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
