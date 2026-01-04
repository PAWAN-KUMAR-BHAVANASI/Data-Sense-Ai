# 🚀 Deploy DataSense AI to Vercel

Your React app is ready to deploy! Follow these simple steps:

## **Step 1: Prepare Your Code**

Ensure everything is committed to Git:
```bash
cd "C:\Users\A s u s\OneDrive\Desktop\Data Sense Ai\Data-Sense-Ai"
git add .
git commit -m "Setup Vercel deployment with environment variables"
git push origin main
```

---

## **Step 2: Connect to Vercel**

### Option A: Via Vercel CLI (Fastest)
```bash
npm i -g vercel
vercel
```
Follow the prompts to connect your GitHub account and select this project.

### Option B: Via Web Browser (Easiest)
1. Go to **https://vercel.com**
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo: `Data-Sense-Ai`
5. Click **"Import"**

---

## **Step 3: Configure Environment Variables**

In Vercel Dashboard:
1. Click on your project
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** `AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg`
   - **Environments:** Production, Preview, Development

---

## **Step 4: Deploy**

1. Click the **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Your app is live! 🎉

**Live URL:** `https://your-project.vercel.app`

---

## **Troubleshooting**

### Build Fails?
```bash
# Test locally first
npm install
npm run build
```

### Blank Page?
- Check browser console for errors
- Verify `VITE_GEMINI_API_KEY` is set
- Clear browser cache

### API Not Working?
- Confirm environment variable is set in Vercel
- Check that API key is valid
- Verify no CORS issues

---

## **Custom Domain**

To use your own domain:
1. Vercel Dashboard → **Settings** → **Domains**
2. Add your domain
3. Update DNS records (Vercel shows instructions)

---

## **Next Steps**

✅ Environment variables configured  
✅ Build settings optimized  
✅ Ready to deploy!

**What to do next:**
1. Push code to GitHub
2. Connect project to Vercel
3. Add environment variable
4. Click Deploy

**Questions?** See `VERCEL_DEPLOYMENT.md` for more details.

