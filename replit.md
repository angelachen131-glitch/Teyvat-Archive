# Teyvat Archive - Genshin Impact Information Website

## Overview

Teyvat Archive is a comprehensive Genshin Impact companion website that helps players explore characters, artifacts, team compositions, and gameplay guides. The application features a visually rich, anime-game aesthetic inspired by Genshin Impact's official UI and premium gaming wikis like Prydwen and Honey Impact.

The site serves both new and experienced players with:
- **Character Database**: Detailed builds, team recommendations, and character filtering by element, weapon, rarity, and region
- **Artifact Sets Database**: Complete artifact information with bonuses and recommended characters
- **Favorites System**: Save favorite characters to a persistent list using localStorage
- **Interactive Team Builder**: Build 4-character teams with elemental reaction analysis and detailed synergy calculator
- **Domain Finder**: Artifact farming guide with daily rotation schedules and character recommendations
- **Build Comparison**: Compare different artifact and weapon combinations side-by-side
- **Beginner's Guide**: Progression tips, resource management, and gameplay mechanics
- **Advanced Search**: Global search functionality across all content
- **Dark/Light Mode**: Full theme support with persistent user preference

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing with the following structure:
- `/` - Home page with hero section and feature cards
- `/characters` - Filterable character grid with favorite buttons
- `/characters/:id` - Detailed character pages with lore and builds
- `/artifacts` - Artifact sets database with filtering
- `/team-builder` - Interactive team composition tool with synergy analysis
- `/favorites` - Personalized collection of saved characters
- `/domains` - Artifact farming guide with daily rotation filters
- `/build-comparison` - Side-by-side build comparison tool
- `/guide` - Beginner's guide

**State Management**: 
- TanStack Query (React Query) v5 for server state management and data fetching
- Local React state for UI interactions (filters, dialogs, mobile menu)
- Context API for theme management (light/dark mode)
- localStorage for favorites persistence

**UI Component Library**: Radix UI primitives with custom shadcn/ui components
- Follows the "New York" shadcn style variant
- Custom design system with gaming-inspired aesthetics
- Responsive components with mobile-first approach
- Tailwind CSS for styling with custom color tokens for Genshin elements
- Lucide React for icons and visual cues

**Design System**:
- Typography: Inter/Poppins for headings, Inter/Outfit for body, Space Grotesk/JetBrains Mono for stats
- Element-based color scheme (Pyro, Hydro, Cryo, Electro, Anemo, Geo, Dendro)
- Consistent spacing using Tailwind's scale (4, 6, 8, 12, 16, 24)
- Card-based layouts with hover effects and subtle animations
- Custom CSS variables for theming support
- hover-elevate and active-elevate-2 utilities for interaction feedback

**Client Features**:
- **Favorites Hook** (`use-favorites.ts`): Custom React hook managing favorites with localStorage persistence
- **Synergy Analysis**: Real-time team synergy calculation showing element coverage, role distribution, and character pair ratings
- **Character Filtering**: Multi-criteria filtering (element, weapon, rarity, region)
- **Search Dialog**: Global search across characters and artifacts
- **Build Comparison**: Compare up to 3 builds with detailed stat requirements and recommendations
- **Domain Filtering**: Filter domains by weekday for optimal farming routes

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful endpoints with JSON responses:
- `GET /api/characters` - Retrieve all characters with images and metadata
- `GET /api/characters/:id` - Get specific character details
- `GET /api/artifacts` - Fetch all artifact sets with bonuses
- `GET /api/teams` - List saved team compositions (future persistence)
- `POST /api/teams` - Create new team composition (future persistence)
- `DELETE /api/teams/:id` - Remove team composition (future persistence)

**Data Layer**: In-memory storage (`MemStorage` class) with interfaces designed for future database migration
- Character data includes: id, name, element, weapon, rarity, region, role, description, lore, talents, recommended artifacts/weapons, build priorities, constellations, imageUrl
- Artifact data includes: id, name, 2-piece & 4-piece bonuses, domain, recommended characters, artifact types, imageUrl
- Team data includes: id, name, character IDs, description, synergies
- Domain data includes: location, region, level, artifact sets, weekday rotation, recommended characters

**Validation**: Zod schemas integrated with Drizzle for type-safe data validation
- Schema definitions in `shared/schema.ts` for cross-platform validation
- Strong typing between frontend and backend using shared types
- ElementalReaction interface for synergy calculations

### Data Storage

**Current Implementation**: In-memory storage with seeded data
- `MemStorage` class implementing `IStorage` interface
- Pre-populated with character, artifact, and domain data on initialization
- Suitable for demonstration and production single-instance deployments
- Image URLs sourced from enka.network CDN

**Database Configuration**: PostgreSQL setup via Drizzle ORM (ready for migration)
- Drizzle Kit configured for PostgreSQL dialect
- Schema definitions prepared in `shared/schema.ts`
- Migration folder structure in place (`./migrations`)
- Environment variable expected: `DATABASE_URL` for future migrations

**Schema Design**:
- Enum types for game constants (elements, weapons, regions, roles, artifact types)
- TypeScript interfaces with runtime validation via Zod
- Character and artifact relationships designed for relational storage
- Team composition relationships for multi-user persistence

### Build & Development

**Development Server**: Vite dev server with HMR (Hot Module Replacement)
- Custom middleware integration with Express
- Separate client and server TypeScript compilation
- Path aliases for cleaner imports (`@/`, `@shared/`, `@assets/`)
- Fast module reloading with React Fast Refresh

**Production Build**:
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js`
- Static file serving in production mode
- Optimized bundle splitting and code splitting

**Type Safety**: Strict TypeScript configuration across the monorepo
- Shared types between client and server
- Path mapping for module resolution
- Incremental compilation for faster rebuilds
- Strict null checks and no implicit any

## Recent Changes (Latest Session)

### Features Added
1. **Favorites System** (localStorage-based)
   - Custom `useFavorites` hook with localStorage persistence
   - Favorite buttons on character cards with visual feedback
   - Dedicated Favorites page showing all saved characters
   - Heart icon in navigation with count badge

2. **Team Synergy Calculator**
   - Element coverage visualization (1-5 scale)
   - Role distribution analysis (DPS, Sub-DPS, Support, Healer)
   - Character pair synergy rating (Excellent/Good)
   - Warnings for missing DPS or healer roles
   - Recommendations for team composition improvements

3. **Domain Finder Tool**
   - Complete artifact domain database with 8 locations
   - Daily rotation schedule filtering
   - Character recommendations for each domain
   - Region organization and level indicators
   - Integration with artifact database for bonus display

4. **Build Comparison Tool**
   - Compare up to 3 character builds side-by-side
   - Pre-configured sample builds for 5+ characters
   - Artifact set and weapon recommendations
   - Main stats and sub-stats priority display
   - Build selection dialog for easy browsing

### UI/UX Enhancements
- Added Domains and Build Comparison navigation links
- Enhanced Team Builder with detailed synergy analysis card
- Character cards now include favorite heart button
- Favorites count badge in header
- Improved visual hierarchy with alerts and info boxes
- Better mobile responsiveness for all new features

## External Dependencies

### UI & Component Libraries
- **Radix UI**: Headless UI primitives for accessible components (accordion, dialog, dropdown, popover, tabs, etc.)
- **shadcn/ui**: Pre-built component library using Radix UI
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **class-variance-authority**: Component variant management
- **Lucide React**: Icon library for UI elements (icons for all features and actions)

### Data & State Management
- **TanStack Query v5**: Server state management and data fetching with caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation and type inference
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Development Tools
- **Vite**: Build tool and dev server with React plugin and fast refresh
- **esbuild**: Fast JavaScript bundler for server builds
- **tsx**: TypeScript execution for development
- **Drizzle Kit**: Database migration tool

### Database & ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-zod**: Integration between Drizzle schemas and Zod

### Routing & Navigation
- **Wouter**: Lightweight client-side routing (~1.2KB)

### Optional Integrations (Development)
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Fonts
- Google Fonts: Inter, Poppins, Space Grotesk, JetBrains Mono (loaded via CDN)

## Development Notes

### File Structure
```
client/src/
  ├── pages/
  │   ├── home.tsx
  │   ├── characters.tsx
  │   ├── character-detail.tsx
  │   ├── artifacts.tsx
  │   ├── team-builder.tsx
  │   ├── favorites.tsx (NEW)
  │   ├── domains.tsx (NEW)
  │   ├── build-comparison.tsx (NEW)
  │   ├── beginners-guide.tsx
  │   └── not-found.tsx
  ├── components/
  │   ├── layout.tsx
  │   ├── search-dialog.tsx
  │   ├── theme-toggle.tsx
  │   ├── theme-provider.tsx
  │   └── ui/ (shadcn components)
  ├── hooks/
  │   ├── use-favorites.ts (NEW)
  │   └── use-toast.ts
  ├── lib/
  │   ├── utils.ts
  │   └── queryClient.ts
  └── App.tsx

shared/
  └── schema.ts

server/
  ├── index.ts
  ├── storage.ts
  ├── routes.ts
  └── vite.ts
```

### Next Phase Features (For Future Implementation)
1. **Genshin.dev API Integration** - Real-time character and artifact data updates
2. **Build Saving** - Allow users to save custom builds with persistence
3. **Team Sharing** - Share team compositions via shareable links
4. **Event Calendar** - Upcoming events and content schedule
5. **Achievement Tracker** - Track completion milestones
6. **Mobile App** - React Native version for iOS/Android

### Known Issues
- Minor Radix UI accessibility warnings for DialogContent aria-describedby (non-critical)
- Image loading fallback needed for missing character images
- Domain data is currently hardcoded (future: integrate with game wiki API)

### Performance Optimizations
- Lazy loading for character and artifact images
- Efficient filtering algorithms with memoization
- TanStack Query caching for API responses
- Mobile-optimized viewport and touch interactions
