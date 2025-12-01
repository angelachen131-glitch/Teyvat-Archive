# Teyvat Archive - Vercel Deployment Guide ✅

Your Teyvat Archive application is now ready for deployment to Vercel! This complete full-stack application includes a React frontend with a powerful Express.js backend serving game data.

## What You Have

### Frontend (React)
- ✅ Complete character grid with 84+ characters
- ✅ Character detail pages with full information
- ✅ Artifact database with filtering
- ✅ Team builder with synergy calculator
- ✅ Domain finder for artifact farming
- ✅ Build comparison tool
- ✅ Favorites system (localStorage)
- ✅ Beginner's guide
- ✅ Dark/Light mode support
- ✅ Fully responsive design
- ✅ Tailwind CSS styling with gaming aesthetic

### Backend (Express.js)
- ✅ `/api/characters` - Get all characters
- ✅ `/api/characters/:id` - Get character details
- ✅ `/api/artifacts` - Get all artifacts
- ✅ `/api/teams` - Team management endpoints
- ✅ In-memory storage (MemStorage) with full character/artifact data
- ✅ TypeScript for type safety
- ✅ Proper error handling and logging

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in or create account (free tier available)
3. Click "New Project"
4. Select "Import Git Repository"
5. Choose your GitHub repository
6. Vercel auto-detects the configuration
7. Click "Deploy"

### 3. Configure (Optional - for future database use)
If you add a database later, set these environment variables in Vercel dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random string for sessions

## How It Works on Vercel

### Build Phase
1. Vercel runs `npm run build`
2. Vite builds React frontend → `dist/public/`
3. esbuild bundles Express server → `dist/index.js`

### Runtime Phase
1. **Frontend requests** (e.g., `/`, `/characters`, `/team-builder`)
   - Vercel rewrites → `dist/public/index.html`
   - React router handles navigation

2. **API requests** (e.g., `/api/characters`)
   - Vercel routes → `api/handler.ts` (serverless function)
   - Express processes → Returns JSON data

## File Structure

```
project-root/
├── api/
│   └── handler.ts              ← Vercel serverless entry point
├── client/
│   ├── index.html              ← Frontend HTML entry point
│   └── src/
│       ├── App.tsx             ← React router & main app
│       ├── pages/              ← All page components
│       ├── components/         ← Reusable components
│       ├── hooks/              ← Custom hooks (favorites, etc)
│       └── lib/                ← Utilities (queryClient, etc)
├── server/
│   ├── storage.ts              ← Data storage (84 characters)
│   ├── routes.ts               ← API route definitions
│   └── vite.ts                 ← Vite utilities
├── shared/
│   └── schema.ts               ← Shared types & schemas
├── dist/
│   ├── public/                 ← Built frontend (Vite output)
│   └── index.js                ← Built server (esbuild output)
├── vercel.json                 ← Vercel configuration ✅
├── vite.config.ts              ← Vite configuration
├── package.json                ← Dependencies
└── tsconfig.json               ← TypeScript configuration
```

## Vercel Configuration Explained

The `vercel.json` file tells Vercel:

```json
{
  "buildCommand": "npm run build",           // Build frontend & backend
  "framework": "vite",                       // Vite is the framework
  "outputDirectory": "dist/public",          // Frontend output location
  "rewrites": [                              // Smart routing
    {
      "source": "/((?!api/).*)(?:\\.\\w+)?$",  // All non-API routes
      "destination": "/index.html"              // → Serve React app
    }
  ],
  "headers": [                               // Caching rules
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=60" }
      ]
    }
  ]
}
```

## Testing Locally Before Deploying

```bash
# Development (uses Vite dev server with HMR)
npm run dev

# Verify build works
npm run build

# Check API endpoint
curl http://localhost:5000/api/characters | head -c 200

# Visit app
# Frontend: http://localhost:5000
# API: http://localhost:5000/api/characters
```

## After Deployment

### Access Your App
- URL: `https://your-project.vercel.app`
- Or your custom domain if configured

### Verify Everything Works
1. ✅ Home page loads
2. ✅ Click "Characters" - see grid with 84 characters
3. ✅ Click a character - see detail page with full info
4. ✅ Add to favorites - heart button fills, persists in localStorage
5. ✅ Click "Team Builder" - build and save teams
6. ✅ Click "Domains" - see artifact farming guide
7. ✅ Dark mode toggle - switches theme seamlessly
8. ✅ All images load from enka.network CDN
9. ✅ Search/filter by element, region, rarity works
10. ✅ All pages load and interact correctly

## Troubleshooting

### Issue: Vercel shows "404" or raw code
**Solution**: Reload page (cache issue). Check `vercel.json` rewrites are correct.

### Issue: API returns 404 errors
**Solution**: Verify `api/handler.ts` routes match `/api/` prefix. Check Vercel logs.

### Issue: Images don't load
**Solution**: Check browser console. Images from `https://enka.network/ui/...` may have CORS - this is normal for external CDNs.

### Issue: Slow first load
**Solution**: Normal - Vercel cold start takes 2-3 seconds. Subsequent requests are instant.

## Performance & Limits

Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ Serverless functions (30 second timeout)
- ✅ 3GB function memory
- ✅ Custom domain support (with DNS)

Your app fits perfectly on free tier!

## Database Migration (Future)

When ready to persist team saves across deployments:

1. Create PostgreSQL database (free options: Neon, Railway, Supabase)
2. Add `DATABASE_URL` environment variable to Vercel
3. Update `server/storage.ts` to use Drizzle ORM instead of MemStorage
4. Run migrations: `npm run db:push`

## Advanced: Custom Domain

1. In Vercel dashboard → Project Settings → Domains
2. Add your domain (e.g., `teyvat-archive.com`)
3. Follow DNS instructions to point domain to Vercel
4. SSL certificate auto-generates

## Monitoring & Logs

Monitor your deployed app:
- **Vercel Dashboard**: Real-time logs and analytics
- **Function Logs**: View API request logs
- **Error Tracking**: Automatic error reporting
- **Performance**: Analytics tab shows response times

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)

## Summary

You're all set! Your Teyvat Archive application is production-ready:

✅ Frontend with 8 major features
✅ Backend API with character/artifact data
✅ Vercel configuration for serverless deployment
✅ Type-safe TypeScript throughout
✅ Responsive design for all devices
✅ Zero-cost deployment on Vercel free tier

**Next Step**: Push to GitHub and connect to Vercel for instant deployment!

---

**Built with**: React 18, Express.js, TypeScript, Vite, Tailwind CSS, Vercel
**Total Characters**: 84 unique characters with full data
**Ready for**: Immediate production deployment ✅
