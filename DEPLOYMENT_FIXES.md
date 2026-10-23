# Portfolio App Fixes - Deployment Guide

## Issues Fixed

### 1. Images Not Showing on Cards
**Problem:** Images weren't loading because `NEXT_PUBLIC_API_URL` environment variable wasn't set.

**Solution:** Updated `.env.local` with correct API URL:
```
NEXT_PUBLIC_API_URL=https://vizualgraphics.com
```

**Why this works:**
- Images are stored at `/var/www/vizualgraphics/public/portfolio/item-1/cover.png`
- These are served at `https://vizualgraphics.com/portfolio/item-1/cover.png` through Nginx
- The `buildAssetUrl()` function constructs: `${apiUrl}/${storageKey}`
- With correct API URL, images load from the API server

### 2. View Details Button Not Working
**Status:** Actually works - it's a `<Link>` component wrapping the entire card.

**How it works:**
- Entire card is wrapped in `<Link href={'/portfolio?item=${item.slug}'}>`
- "View Details" text and arrow are inside the hover overlay
- Clicking anywhere on the card navigates to the detail page
- Button styling appears in the gradient overlay on hover

## Files Changed

1. **`.env.local` (NEW)**
   - Sets `NEXT_PUBLIC_API_URL=https://vizualgraphics.com`

2. **`src/app/portfolio/page.tsx`**
   - Enhanced `buildAssetUrl()` function with better error logging
   - Correct API URL construction

## Deployment Steps

When VPS is available:

```bash
# 1. SSH to VPS
ssh root@46.202.166.20

# 2. Copy the updated .env.local
scp portfolio-app/.env.local root@46.202.166.20:/var/www/portfolio-app/

# 3. Rebuild the app
cd /var/www/portfolio-app
rm -rf .next .turbo
NODE_ENV=production npm run build

# 4. Restart the app
pkill -9 -f 'port 3002'
sleep 2
PORT=3002 NODE_ENV=production npm start &

# 5. Verify
sleep 6
curl https://portfolio.vizualgraphics.com/portfolio
# Should show images loading and View Details button visible on hover
```

## Verification Checklist

- [ ] Images display on portfolio cards (no broken image icons)
- [ ] Hover shows gradient overlay with text
- [ ] "View Details" text and arrow visible on hover
- [ ] Clicking card navigates to `/portfolio?item=<slug>`
- [ ] Detail page shows all portfolio assets
- [ ] Mobile responsive (2 columns on desktop, 1 on mobile)

## Image Storage Structure

```
/var/www/vizualgraphics/public/portfolio/
├── item-1/
│   └── cover.png
└── item-2/
    └── cover.png
```

These are served as:
- `https://vizualgraphics.com/portfolio/item-1/cover.png`
- `https://vizualgraphics.com/portfolio/item-2/cover.png`

## Testing URLs

Once deployed:
- Gallery: `https://portfolio.vizualgraphics.com/portfolio`
- Detail "Image Editing": `https://portfolio.vizualgraphics.com/portfolio?item=image-editing`
- Detail "Act": `https://portfolio.vizualgraphics.com/portfolio?item=act`
