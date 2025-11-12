# Teyvat Archive Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Genshin Impact's official UI, Honkai Star Rail interface, and premium gaming wikis like Prydwen and Honey Impact. The design should feel like an official companion to the game while maintaining clarity and usability.

## Core Design Principles
1. **Fantasy Elegance**: Refined anime-game aesthetic with ethereal gradients and soft glows
2. **Information Clarity**: Dense data presented in scannable, organized layouts
3. **Visual Hierarchy**: Bold typography and strategic spacing guide users through content
4. **Interactive Delight**: Subtle animations enhance engagement without distraction

## Typography
- **Headings**: Inter or Poppins (600-700 weight) for clean, modern hierarchy
- **Body Text**: Inter or Outfit (400-500 weight) for excellent readability
- **Accent/Stats**: Space Grotesk or JetBrains Mono (500-600 weight) for numbers and game stats
- **Scale**: text-4xl/5xl for page headers, text-2xl/3xl for section headers, text-lg for card titles, text-base for body

## Layout System
**Spacing Units**: Use Tailwind's 4, 6, 8, 12, 16, 24 for consistent rhythm
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Card padding: p-6 to p-8
- Grid gaps: gap-6 to gap-8

**Container Strategy**:
- Full-width sections with max-w-7xl inner containers
- Content sections: max-w-6xl
- Text-heavy areas: max-w-4xl

## Component Library

### Navigation
- Sticky header with transparent-to-solid transition on scroll
- Logo left, main nav center, search/dark mode toggle right
- Mobile: Hamburger menu with slide-in drawer

### Hero Section (Home Page)
- Large hero image showcasing Teyvat landscape (fantasy artwork with multiple regions visible)
- 70vh height with gradient overlay (dark at bottom for text readability)
- Centered headline "Explore the World of Teyvat" with tagline
- Prominent search bar (w-full max-w-2xl) with element icons
- Blur-backdrop buttons for main CTAs

### Character Cards (Grid Layout)
- 4-column grid (lg), 3-column (md), 2-column (sm), 1-column (mobile)
- Each card: Character portrait, element badge (top-right corner), name, weapon type icon, star rarity
- Aspect ratio: 3:4 for character portraits
- Hover: Subtle lift (translate-y-1) with shadow increase
- Border with subtle glow effect matching element color

### Filter System
- Horizontal filter bar with pill-shaped buttons
- Active state: filled background, inactive: outline only
- Group filters by category (Element | Weapon | Rarity | Region)
- Clear all filters option

### Character Detail Pages
- Hero: Full-width character artwork (banner style, ~400px height)
- Two-column layout: Left (portrait + quick stats), Right (detailed info tabs)
- Tabbed interface: Lore | Build | Talents | Teams
- Stat cards with icon + number + label format

### Artifact Cards
- 3-column grid showcasing artifact sets
- Each card: Set icon, set name, 2-piece/4-piece bonus descriptions
- Tag system for farming domains
- Expandable sections for recommended characters

### Team Builder Interface
- 4 character slots in horizontal row (desktop) or 2x2 grid (mobile)
- Drag-and-drop or click-to-add interaction
- Elemental reaction indicators between slots
- Summary panel below showing team synergies

### Beginner's Guide
- Single column layout with max-w-4xl
- Section cards with left-aligned icon, title, and content
- Accordion-style expandable tips
- Progress checklist format for key tasks

### Search Component
- Global search overlay (full-screen on mobile, centered modal on desktop)
- Live results grouped by type (Characters | Artifacts | Domains)
- Result cards with thumbnail + name + category tag

## Visual Elements

### Images
1. **Hero Image**: Epic Teyvat landscape showing multiple nations (fantasy sky, diverse terrain)
2. **Character Portraits**: Official character art from game (vertical format)
3. **Region Headers**: Themed header images for Mondstadt, Liyue, Inazuma, etc.
4. **Artifact Icons**: Set icons from game assets
5. **Element Badges**: Pyro, Hydro, Cryo, Electro, Anemo, Geo, Dendro symbols

### Gradients & Effects
- Subtle radial gradients for card backgrounds
- Element-specific accent colors for badges and borders
- Soft box shadows: shadow-lg for cards, shadow-2xl for modals
- Backdrop blur for overlays and glass-morphic elements

### Animations
- Card hover: transform scale(1.02) with 200ms transition
- Page transitions: smooth fade-in
- Filter selections: quick color transition
- Avoid: Excessive scroll animations, parallax effects

## Responsive Behavior
- **Desktop (1280px+)**: Full multi-column layouts, sidebar filters
- **Tablet (768-1279px)**: Reduce columns, stack some sections
- **Mobile (<768px)**: Single column, hamburger nav, bottom sheet filters, full-width search

## Footer
- Three-column layout: About | Quick Links | Resources
- Social media icons
- Newsletter signup form
- "Fan-made site" disclaimer with official Genshin links
- Copyright and credits section

## Accessibility
- High contrast text throughout (WCAG AA minimum)
- Focus states on all interactive elements
- Alt text for all character/artifact images
- Keyboard navigation support
- Screen reader labels for icon-only buttons