# 🎯 Quick Start Guide

Get DataSense AI running in **2 minutes**!

---

## **Prerequisites**
- Node.js 18+ (check: `node -v`)
- Python 3.9+ (check: `python --version`)
- Git (check: `git --version`)

---

## **Local Development Setup**

### **Step 1: Install Frontend Dependencies**
```bash
npm install
```

### **Step 2: Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### **Step 3: Create .env File**
```bash
# In project root, create .env
VITE_BACKEND_URL=http://localhost:5000
VITE_GEMINI_API_KEY=AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg
```

---

## **Run Locally (2 Terminal Windows)**

### **Terminal 1: Backend (Flask)**
```bash
cd backend
python run.py
```
✅ Should show: `Running on http://127.0.0.1:5000`

### **Terminal 2: Frontend (React)**
```bash
npm run dev
```
✅ Should show: `Local: http://localhost:5173`

---

## **Test the App**

1. Open http://localhost:5173 in browser
2. Upload a CSV or Excel file
3. View "Report Canvas" tab (Recharts)
4. Click "Seaborn Stats" tab
5. Click "Generate Plot" buttons
6. See Seaborn visualizations! 🎨

---

## **Production Deployment**

See **FULL_STACK_DEPLOYMENT.md** for:
- ✅ Deploy React to Vercel
- ✅ Deploy Flask to Render/Railway
- ✅ Configure environment variables
- ✅ Final testing

---

## **Project Structure**

```
Data-Sense-Ai/
├── backend/
│   ├── app.py              ← Flask API
│   ├── requirements.txt     ← Python packages
│   └── run.py             ← Easy startup script
│
├── components/
│   ├── Dashboard.tsx       ← Main dashboard
│   ├── SeabornDashboard.tsx ← Stats visualizations
│   ├── ChatInterface.tsx
│   ├── FileUpload.tsx
│   └── ...
│
├── services/
│   └── geminiService.ts    ← AI integration
│
├── App.tsx                 ← React root
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## **API Reference**

All endpoints POST to `http://localhost:5000/api/...`

| Endpoint | Purpose | Data |
|----------|---------|------|
| `/plots/heatmap` | Correlation matrix | `{data: [...]}`  |
| `/plots/distribution` | Histogram + box | `{data: [...], column: "col_name"}` |
| `/plots/scatter` | Scatter + regression | `{data: [...], x: "x_col", y: "y_col"}` |
| `/plots/pairplot` | Multi-variable pairs | `{data: [...]}` |
| `/plots/violin` | Distribution by group | `{data: [...], x: "cat_col", y: "num_col"}` |
| `/analysis/summary` | Stats summary | `{data: [...]}` |

---

## **Troubleshooting**

### Backend won't start?
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall packages
cd backend
pip install --upgrade -r requirements.txt

# Try running directly
python app.py
```

### Plots not showing in UI?
```bash
# Check backend is running
curl http://localhost:5000/health
# Should get: {"status": "ok", ...}

# Check .env VITE_BACKEND_URL is correct
cat .env | findstr VITE_BACKEND_URL
# Should show: VITE_BACKEND_URL=http://localhost:5000
```

### CORS errors?
✅ Already handled in `app.py` with Flask-CORS
- No additional config needed
- Backend accepts all origins locally

---

## **Build for Production**

```bash
# Build React
npm run build
# Creates: dist/ folder

# Test production build locally
npm run preview
# Open: http://localhost:4173
```

---

## **Deploy to Cloud**

### React → Vercel
```bash
git push origin main
# Vercel auto-deploys on push
```

### Flask → Render
1. Push to GitHub
2. Connect Render to GitHub repo
3. Deploy with `gunicorn --chdir backend app:app`

See **FULL_STACK_DEPLOYMENT.md** for detailed steps!

---

## **Environment Variables Explained**

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_BACKEND_URL` | Where frontend calls backend | `http://localhost:5000` |
| `VITE_GEMINI_API_KEY` | Google AI API key | `AIzaSy...` |
| `FLASK_ENV` | Backend mode | `production` or `development` |

---

## **Common Commands**

```bash
# Start everything
npm run dev          # Frontend
cd backend && python run.py  # Backend (new terminal)

# Build
npm run build        # Minified React app

# Install dependencies
npm install          # React packages
pip install -r backend/requirements.txt  # Python packages

# Test production
npm run preview      # Test built React

# Push to GitHub
git add .
git commit -m "message"
git push origin main
```

---

## **Next Steps**

- [ ] Run locally and test all Seaborn plots
- [ ] Try with your own CSV data
- [ ] Deploy to Vercel + Render (see FULL_STACK_DEPLOYMENT.md)
- [ ] Share with team!

---

**Questions?** Check FULL_STACK_DEPLOYMENT.md or relevant service docs (Flask, Vercel, Render)

