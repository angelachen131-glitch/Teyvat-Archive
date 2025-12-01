# Vercel Deployment Checklist

## Pre-Deployment Verification

- [x] `api/handler.ts` created - serverless function entry point
- [x] `vercel.json` created - deployment configuration
- [x] All routes migrated to API handler
- [x] Storage layer accessible from serverless function
- [x] TypeScript types properly imported
- [x] Express app properly exported

## Files Modified/Created

- ✅ Created: `vercel.json` - Vercel configuration
- ✅ Created: `api/handler.ts` - Serverless function handler
- ✅ Created: `VERCEL_DEPLOYMENT.md` - Deployment guide
- ⚠️  Skipped: `package.json` - Cannot edit directly (use packager_install_tool if changes needed)

## What to Do Next

### Option 1: Deploy Now (Recommended)
```bash
1. Push your code to GitHub
2. Visit vercel.com and import your repository
3. Vercel will auto-detect and deploy
```

### Option 2: Manual Build Test
```bash
npm run build          # Builds frontend with Vite
```

### Option 3: Stay on Replit (Current)
```bash
npm run dev            # Uses server/index.ts (traditional Express)
```

## Key Changes Made

1. **api/handler.ts** - New serverless function
   - Exports default handler for Vercel
   - Includes all API routes
   - Initializes MemStorage
   - Handles middleware

2. **vercel.json** - Deployment config
   - Points to Vite frontend build
   - Routes /api/* to serverless function
   - Sets memory and timeout limits

## Verification Steps After Deployment

1. [ ] Home page loads
2. [ ] Character grid loads (pagination works)
3. [ ] Character detail page works
4. [ ] Favorite button works
5. [ ] Search functionality works
6. [ ] Team builder loads and synergy calculation works
7. [ ] Domain finder works
8. [ ] Build comparison works
9. [ ] Dark/light mode toggle works
10. [ ] All images load from enka.network

## Environmental Setup on Vercel

If using database later, set these in Vercel dashboard:

```
DATABASE_URL = (your database connection string)
SESSION_SECRET = (generate random string)
NODE_ENV = production
```

## Troubleshooting Quick Links

- Build fails: Check imports in `api/handler.ts`
- API 404: Verify routes in serverless function
- Images missing: Check enka.network connectivity
- Cold start slow: Normal on first request
- Storage data lost: Expected - in-memory (upgrade to database when needed)

## Support

For issues, refer to:
- `VERCEL_DEPLOYMENT.md` - Full deployment guide
- GitHub issues
- Vercel documentation: https://vercel.com/docs
