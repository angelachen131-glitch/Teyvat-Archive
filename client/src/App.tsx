import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Characters from "@/pages/characters";
import CharacterDetail from "@/pages/character-detail";
import Artifacts from "@/pages/artifacts";
import TeamBuilder from "@/pages/team-builder";
import BeginnersGuide from "@/pages/beginners-guide";
import Favorites from "@/pages/favorites";
import Domains from "@/pages/domains";
import BuildComparison from "@/pages/build-comparison";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/characters" component={Characters} />
        <Route path="/characters/:id" component={CharacterDetail} />
        <Route path="/artifacts" component={Artifacts} />
        <Route path="/team-builder" component={TeamBuilder} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/domains" component={Domains} />
        <Route path="/build-comparison" component={BuildComparison} />
        <Route path="/guide" component={BeginnersGuide} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
