# Vercel Serverless Deployment Guide for Teyvat Archive

## Overview

This guide explains how to deploy the Teyvat Archive application to Vercel as serverless functions. The app has been restructured to work with Vercel's serverless architecture while maintaining all existing functionality.

## Current Setup

- **Frontend**: React with Vite (builds to `dist/public`)
- **Backend**: Express.js API routes (moved to `api/handler.ts`)
- **Storage**: In-memory MemStorage (no database required)
- **Configuration**: `vercel.json` handles routing and build configuration

## Deployment Steps

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect your GitHub account and select your Teyvat Archive repository
5. Vercel will auto-detect the project settings

### 2. Configure Environment Variables (if needed)

If using a database in the future, add environment variables in Vercel:

1. In your Vercel dashboard, go to Project Settings → Environment Variables
2. Add any required variables:
   - `DATABASE_URL` (if using PostgreSQL)
   - `SESSION_SECRET` (for sessions)
   - `NODE_ENV` (should be `production`)

### 3. Deploy

**Option A: Automatic Deployment (Recommended)**
- Push to `main` branch → Vercel automatically deploys
- Each commit triggers a new deployment

**Option B: Manual Deployment**
- In Vercel dashboard, click "Deploy" button
- Or use Vercel CLI: `vercel deploy --prod`

### 4. Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain (e.g., teyvat-archive.com)
3. Update DNS records as shown in Vercel dashboard

## File Structure for Vercel

```
project-root/
├── api/
│   └── handler.ts           # Serverless function entry point
├── client/                  # React frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       └── App.tsx
├── server/
│   ├── storage.ts           # In-memory storage (imported by api/)
│   ├── routes.ts            # Route definitions (imported by api/)
│   └── vite.ts              # Vite utilities
├── shared/
│   └── schema.ts            # Shared types and schemas
├── vercel.json              # Vercel configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies

## How It Works

1. **Vercel receives request** → Route `/api/*` request to serverless function
2. **api/handler.ts processes** → Express app handles the request
3. **MemStorage responds** → Returns JSON data to frontend
4. **Frontend renders** → React displays the response

## API Endpoints

All endpoints work exactly the same on Vercel:

- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get character details
- `GET /api/artifacts` - Get all artifacts
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `DELETE /api/teams/:id` - Delete team

## Build Configuration

The `vercel.json` file tells Vercel:
- Build command: `npm run build` (runs Vite build)
- Output directory: `dist/public` (Vite frontend build)
- Functions location: `api/**/*.ts` (serverless functions)
- Function specs: 3GB memory, 30-second timeout

## Local Development

For local development, continue using:

```bash
npm run dev           # Runs local Express server on port 5000
```

This will:
- Start Express backend
- Start Vite dev server
- Handle both API and frontend on same port

## Troubleshooting

### Build Fails with "Module not found"

- Ensure all imports use correct path aliases (`@/`, `@shared/`, `@assets/`)
- Check that `tsconfig.json` has correct path mappings

### API Routes Return 404

- Verify `api/handler.ts` exports default function
- Check that routes match pattern in `vercel.json`
- Ensure imports in `api/handler.ts` are correct

### Images Not Loading

- Check that enka.network URLs are accessible
- Verify frontend has internet connectivity
- Check browser console for CORS issues

### Cold Start Issues

- First request may be slow (Vercel cold start)
- Subsequent requests will be faster
- Consider upgrading Vercel plan for better performance

## Production Considerations

### Performance
- In-memory storage means data resets on each deployment
- For persistent data, migrate to PostgreSQL
- Consider caching strategies for image CDN

### Security
- Store sensitive environment variables in Vercel dashboard
- Don't commit `.env` files
- Use HTTPS (automatic with Vercel)

### Monitoring
- View logs in Vercel dashboard → Function Logs
- Use Vercel Analytics for performance metrics
- Set up alerts for errors

## Reverting to Replit

To deploy on Replit instead:

1. Use the workflow "Start application" which runs `npm run dev`
2. This starts the traditional Express server from `server/index.ts`
3. No changes needed - Replit handles both frontend and backend automatically

## Next Steps

### After Deployment
1. Test all pages at your Vercel domain
2. Check API endpoints are working (`https://your-domain.vercel.app/api/characters`)
3. Verify favorites work (localStorage persists)
4. Test all filters and search functionality

### Future Improvements
1. Add PostgreSQL database for data persistence
2. Implement user authentication
3. Add caching layer (Redis)
4. Set up CI/CD pipeline
5. Add automated tests

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [Express.js Guide](https://expressjs.com/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

## Summary

Your Teyvat Archive app is now ready for Vercel serverless deployment! The setup maintains all existing features while leveraging Vercel's scalable infrastructure. Push to GitHub, connect to Vercel, and your app will be live instantly.
