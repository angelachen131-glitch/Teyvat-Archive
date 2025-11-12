import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { SearchDialog } from "./search-dialog";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/characters", label: "Characters" },
    { path: "/artifacts", label: "Artifacts" },
    { path: "/team-builder", label: "Team Builder" },
    { path: "/guide", label: "Beginner's Guide" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
            : "bg-background/50 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4" data-testid="header-container">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 cursor-pointer rounded-md px-3 py-2 -ml-3" data-testid="logo">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Teyvat Archive
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="font-medium"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              data-testid="button-search"
              className="hidden sm:flex"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t bg-card">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={location === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t bg-card mt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">About Teyvat Archive</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A comprehensive fan-made guide for Genshin Impact. Explore characters, artifacts, team compositions, and gameplay tips for the world of Teyvat.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://genshin.hoyoverse.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Official Genshin Impact
                  </a>
                </li>
                <li>
                  <a
                    href="https://genshin.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Genshin.gg
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              Teyvat Archive is a fan-made website and is not affiliated with HoYoverse.
            </p>
            <p className="mt-2">
              Genshin Impact™ is a trademark of HoYoverse. All game assets and content are property of their respective owners.
            </p>
            <p className="mt-4">© 2024 Teyvat Archive. Built with passion for Travelers everywhere.</p>
          </div>
        </div>
      </footer>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </div>
  );
}
