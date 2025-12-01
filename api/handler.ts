import express, { type Request, Response, NextFunction } from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Import routes
import { MemStorage } from "../server/storage";
import { insertTeamSchema } from "../shared/schema";

const app = express();

// Middleware
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Initialize storage
const storage = new MemStorage();

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// API Routes - Characters
app.get("/api/characters", async (req, res) => {
  try {
    const characters = await storage.getAllCharacters();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch characters" });
  }
});

app.get("/api/characters/:id", async (req, res) => {
  try {
    const character = await storage.getCharacter(req.params.id);
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch character" });
  }
});

// API Routes - Artifacts
app.get("/api/artifacts", async (req, res) => {
  try {
    const artifacts = await storage.getAllArtifacts();
    res.json(artifacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artifacts" });
  }
});

// API Routes - Teams
app.get("/api/teams", async (req, res) => {
  try {
    const teams = await storage.getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teams" });
  }
});

app.post("/api/teams", async (req, res) => {
  try {
    const insertTeamParsed = insertTeamSchema.safeParse(req.body);

    if (!insertTeamParsed.success) {
      return res.status(400).json({ message: "Invalid team data" });
    }

    const team = await storage.createTeam(insertTeamParsed.data);
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Failed to create team" });
  }
});

app.delete("/api/teams/:id", async (req, res) => {
  try {
    await storage.deleteTeam(req.params.id);
    res.json({ message: "Team deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team" });
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Export for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
