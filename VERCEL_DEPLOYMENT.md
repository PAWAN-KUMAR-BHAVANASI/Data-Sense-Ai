# Vercel Deployment Guide for DataSense AI

## Quick Start - Deploy to Vercel in 3 Steps

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd "C:\Users\A s u s\OneDrive\Desktop\Data Sense Ai\Data-Sense-Ai"
vercel
```

### Step 3: Follow prompts
- Link to existing project or create new
- Choose production/preview
- Set environment variables

---

## Deployment via GitHub (Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repo
4. Click "Import"

### 3. Configure Environment Variables
In Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Add: `VITE_GEMINI_API_KEY` = your API key

### 4. Deploy
- Click "Deploy"
- Your app is live! 🎉

---

## Environment Variables

Required in Vercel:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Update your code to use:
```javascript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

---

## Build Settings

- **Framework:** Vite (auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## Custom Domain

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel will provide)

---

## Troubleshooting

**Build fails?**
- Ensure all dependencies are in package.json
- Check TypeScript errors: `npm run build` locally first

**Blank page?**
- Check browser console for errors
- Verify environment variables are set
- Check index.html file exists

**API calls not working?**
- Verify VITE_GEMINI_API_KEY is set in environment
- Check CORS if using external APIs

---

## Deployment Status

Once deployed, your app will be at:
```
https://your-project-name.vercel.app
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- React Deployment: https://vitejs.dev/guide/static-deploy.html

