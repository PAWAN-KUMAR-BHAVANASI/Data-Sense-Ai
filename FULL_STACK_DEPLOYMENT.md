# 🚀 DataSense AI - Full Stack Deployment Guide

Your app now has **React Frontend + Python/Seaborn Backend**. Here's how to deploy:

---

## **Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (Vercel)               │
│  - Upload CSV/Excel files                               │
│  - View Recharts dashboards                             │
│  - Launch Seaborn statistical analysis                  │
└────────────────────┬────────────────────────────────────┘
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Python Backend (Render/Railway)               │
│  - Flask API on port 5000                               │
│  - Seaborn chart generation                             │
│  - Statistical analysis (heatmaps, distributions, etc.) │
└─────────────────────────────────────────────────────────┘
```

---

## **Part 1: Deploy Backend (Python/Flask)**

### Option A: Deploy to Render (Recommended - Free)

1. **Create account** → https://render.com
2. **Connect GitHub repo** → Data-Sense-Ai
3. **Create New Web Service:**
   - Name: `datasense-backend`
   - Runtime: `Python 3.11`
   - Build command: `pip install -r backend/requirements.txt`
   - Start command: `gunicorn --chdir backend app:app`
4. **Set environment variables:**
   - `FLASK_ENV` = `production`
5. **Deploy** → Get URL like `https://datasense-backend.onrender.com`

### Option B: Deploy to Railway (Free + Generous quota)

1. **Create account** → https://railway.app
2. **Connect GitHub repo**
3. **Add Python service** → Select `backend/requirements.txt`
4. **Get URL** like `https://datasense-backend-prod.up.railway.app`

### Option C: Local Development (Testing)

```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

---

## **Part 2: Update React App with Backend URL**

### Add Backend URL to Environment

Create `.env` file:
```env
VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_GEMINI_API_KEY=AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg
```

Or in `.env.local` for local development:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GEMINI_API_KEY=AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg
```

---

## **Part 3: Deploy Frontend (React/Vercel)**

### If not already deployed:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add Seaborn dashboard integration"
git push origin main
```

2. **Go to Vercel** → https://vercel.com
3. **Import Git Repository** → Select Data-Sense-Ai
4. **Environment Variables:**
   - `VITE_BACKEND_URL` = `https://your-backend-url.onrender.com`
   - `VITE_GEMINI_API_KEY` = Your API key
5. **Deploy** ✅

---

## **Part 4: Test Everything Locally First**

### Terminal 1: Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Should see: `Running on http://127.0.0.1:5000`

### Terminal 2: Start Frontend
```bash
npm run dev
```
Should see: `Local: http://localhost:5173`

### In Browser:
1. Go to `http://localhost:5173`
2. Upload a CSV file
3. Go to **"Seaborn Stats"** tab
4. Click **"Generate Plot"** buttons
5. See Seaborn visualizations appear!

---

## **API Endpoints Available**

### File Upload
```
POST /api/upload
Body: FormData with 'file' key
```

### Plots
```
POST /api/plots/heatmap          → Correlation matrix
POST /api/plots/distribution     → Histogram + box plot
POST /api/plots/scatter          → Scatter with regression
POST /api/plots/pairplot         → Multi-variable pair plot
POST /api/plots/violin           → Distribution by category
```

### Analysis
```
POST /api/analysis/summary       → Statistical summary
```

---

## **Troubleshooting**

### Backend won't start?
```bash
# Make sure Python 3.10+ is installed
python --version

# Install dependencies
pip install flask flask-cors pandas numpy seaborn matplotlib

# Test Flask
python backend/app.py
```

### CORS error in browser?
```
✅ Flask-CORS is already configured in app.py
✅ Backend should accept requests from any origin
```

### Seaborn plots not showing?
1. Check browser console for errors
2. Verify backend is running/deployed
3. Ensure `VITE_BACKEND_URL` is set correctly
4. Check network tab to see API response

### Backend timeout on Render?
- Generating plots can take a few seconds
- First request may be slow (cold start)
- Be patient, it's worth it! ⏳

---

## **File Structure**

```
Data-Sense-Ai/
├── backend/
│   ├── app.py                  # Flask API server
│   └── requirements.txt         # Python dependencies
├── components/
│   ├── Dashboard.tsx          # Updated with Seaborn tab
│   └── SeabornDashboard.tsx   # New Seaborn UI component
├── services/
│   └── geminiService.ts       # Gemini API integration
├── vercel.json                # Vercel config
└── package.json               # React dependencies
```

---

## **Next Steps**

1. ✅ Backend deployed to Render/Railway
2. ✅ Frontend deployed to Vercel
3. ✅ Environment variables configured
4. 🧪 Test with sample data
5. 📊 Try all Seaborn plot types
6. 🚀 Share your app!

---

## **Quick Deploy Commands**

```bash
# Local development (Terminal 1)
cd backend && python app.py

# Local development (Terminal 2)
npm run dev

# Deploy to GitHub
git add .
git commit -m "Seaborn integration complete"
git push origin main

# Then connect to Vercel + Render dashboards
```

---

## **Cost Breakdown**

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel** | Free | React frontend, 100GB bandwidth |
| **Render** | Free | Python backend, 750 hours/month |
| **Google Gemini API** | Free | $0.075/1M tokens |
| **Total** | **Free** | Everything runs on free tier! 🎉 |

---

## **Support**

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Flask Docs:** https://flask.palletsprojects.com
- **Seaborn Docs:** https://seaborn.pydata.org
- **GitHub Issues:** Report bugs on your repo

---

**Happy deploying!** 🎊

