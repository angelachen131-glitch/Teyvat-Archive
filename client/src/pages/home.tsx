import { Link } from "wouter";
import { Sparkles, Users, Box, Swords, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import heroImage from "@assets/generated_images/Teyvat_world_landscape_panorama_b25bb79e.png";

export default function Home() {
  const regions = [
    { name: "Mondstadt", description: "The City of Freedom", color: "from-element-anemo/20 to-background" },
    { name: "Liyue", description: "The Harbor of Contracts", color: "from-element-geo/20 to-background" },
    { name: "Inazuma", description: "The Nation of Eternity", color: "from-element-electro/20 to-background" },
    { name: "Sumeru", description: "The Nation of Wisdom", color: "from-element-dendro/20 to-background" },
    { name: "Fontaine", description: "The Nation of Justice", color: "from-element-hydro/20 to-background" },
    { name: "Natlan", description: "The Nation of War", color: "from-element-pyro/20 to-background" },
  ];

  const features = [
    {
      icon: Users,
      title: "Character Database",
      description: "Explore detailed information on all playable characters, their builds, and team compositions.",
      link: "/characters",
      testId: "card-feature-characters"
    },
    {
      icon: Box,
      title: "Artifact Guide",
      description: "Discover the best artifact sets, their bonuses, and recommended characters for each set.",
      link: "/artifacts",
      testId: "card-feature-artifacts"
    },
    {
      icon: Swords,
      title: "Team Builder",
      description: "Create optimal team compositions and explore elemental synergies and reactions.",
      link: "/team-builder",
      testId: "card-feature-team-builder"
    },
    {
      icon: BookOpen,
      title: "Beginner's Guide",
      description: "Learn essential tips for leveling, resource management, and progression in Teyvat.",
      link: "/guide",
      testId: "card-feature-guide"
    },
  ];

  return (
    <div>
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="font-heading font-bold text-5xl md:text-7xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Explore the World of Teyvat
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto font-medium">
            Your complete companion guide to Genshin Impact's characters, artifacts, and gameplay strategies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/characters">
              <Button size="lg" className="text-base" data-testid="button-browse-characters">
                Browse Characters
              </Button>
            </Link>
            <Link href="/team-builder">
              <Button size="lg" variant="outline" className="text-base backdrop-blur-sm bg-background/50" data-testid="button-build-team">
                Build Your Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Discover Teyvat's Nations
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore the diverse regions of Teyvat, each with unique cultures and elemental themes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-regions">
            {regions.map((region) => (
              <Card
                key={region.name}
                className={`hover-elevate active-elevate-2 cursor-pointer transition-all bg-gradient-to-br ${region.color}`}
                data-testid={`card-region-${region.name.toLowerCase()}`}
              >
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl mb-2" data-testid={`text-region-name-${region.name.toLowerCase()}`}>{region.name}</CardTitle>
                  <CardDescription className="text-base" data-testid={`text-region-desc-${region.name.toLowerCase()}`}>{region.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Everything You Need to Master Genshin
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive guides and tools to enhance your adventure in Teyvat
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.link}>
                <Card
                  className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all group"
                  data-testid={feature.testId}
                >
                  <CardHeader className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
