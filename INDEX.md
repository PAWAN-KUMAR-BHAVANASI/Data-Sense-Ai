# 📚 Project Documentation Index

Welcome to DataSense AI! Use this index to navigate all documentation.

---

## 🎯 Start Here

**First Time Setup?** → [`QUICK_START.md`](./QUICK_START.md)
- 2-minute local development setup
- How to run frontend + backend
- Basic troubleshooting

**Want an Overview?** → [`README_SEABORN.md`](./README_SEABORN.md)
- What was added (Seaborn integration)
- How it works
- Quick feature list

---

## 🚀 Deployment Guides

**Full Stack Deployment** → [`FULL_STACK_DEPLOYMENT.md`](./FULL_STACK_DEPLOYMENT.md)
- Deploy React to Vercel
- Deploy Flask to Render/Railway
- Configure environment variables
- Production best practices

**React Only** → [`DEPLOY_TO_VERCEL.md`](./DEPLOY_TO_VERCEL.md)
- For Vercel deployment
- Build configuration
- Custom domain setup

---

## 📖 Detailed Documentation

**Seaborn Integration Details** → [`SEABORN_INTEGRATION_COMPLETE.md`](./SEABORN_INTEGRATION_COMPLETE.md)
- Architecture explanation
- All features explained
- API reference
- Troubleshooting guide

**Vercel Deployment Details** → [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)
- Step-by-step Vercel setup
- GitHub integration
- Environment variable configuration

**Streamlit Legacy** → [`STREAMLIT_DEPLOYMENT.md`](./STREAMLIT_DEPLOYMENT.md)
- Reference only (not recommended)
- Historical documentation

---

## 💻 Quick Commands

### Local Development
```bash
# Start backend
cd backend && python run.py

# Start frontend (new terminal)
npm run dev

# Visit
http://localhost:5173
```

### Windows Users
```bash
# Or just run
run.bat
```

### Production Build
```bash
# Build React
npm run build

# Test production build
npm run preview
```

### Deploy to GitHub
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## 📁 Project Structure

```
Data-Sense-Ai/
│
├── 📖 DOCUMENTATION
│   ├── QUICK_START.md                    ← START HERE
│   ├── README_SEABORN.md                 ← Overview
│   ├── FULL_STACK_DEPLOYMENT.md         ← Production
│   ├── SEABORN_INTEGRATION_COMPLETE.md  ← Details
│   └── INDEX.md                          ← This file
│
├── 🎨 FRONTEND (React/Vite)
│   ├── App.tsx                          ← Main app
│   ├── index.tsx                        ← Entry point
│   ├── package.json                     ← Dependencies
│   ├── vite.config.ts                   ← Build config
│   ├── tsconfig.json                    ← TypeScript config
│   ├── components/
│   │   ├── Dashboard.tsx                ← Main dashboard (updated)
│   │   ├── SeabornDashboard.tsx         ← NEW Seaborn component
│   │   ├── ChatInterface.tsx
│   │   ├── FileUpload.tsx
│   │   ├── ChartRenderer.tsx
│   │   └── ...
│   └── services/
│       └── geminiService.ts             ← AI integration
│
├── 🐍 BACKEND (Python/Flask)
│   ├── app.py                           ← Flask API (NEW)
│   ├── requirements.txt                 ← Python dependencies (NEW)
│   └── run.py                           ← Startup script (NEW)
│
├── 📊 DATA
│   └── sample_data.csv                  ← Test data (NEW)
│
├── 🔧 SCRIPTS
│   ├── run.bat                          ← Windows launcher (NEW)
│   └── launch.sh                        ← Mac/Linux launcher (NEW)
│
├── ⚙️ CONFIG FILES
│   ├── .env                             ← Environment variables
│   ├── .env.example                     ← Template
│   ├── vercel.json                      ← Vercel config
│   ├── .gitignore                       ← Git ignore rules
│   └── README.md                        ← Original README
│
└── 📦 OTHER
    └── metadata.json
```

---

## 🎯 Common Tasks

### "I want to run it locally"
1. Read [`QUICK_START.md`](./QUICK_START.md)
2. Run `python backend/run.py`
3. Run `npm run dev`
4. Open http://localhost:5173

### "I want to deploy to production"
1. Read [`FULL_STACK_DEPLOYMENT.md`](./FULL_STACK_DEPLOYMENT.md)
2. Deploy React to Vercel
3. Deploy Flask to Render
4. Configure environment variables

### "I want to understand the architecture"
1. Read [`SEABORN_INTEGRATION_COMPLETE.md`](./SEABORN_INTEGRATION_COMPLETE.md)
2. Check the architecture diagram
3. Read through `backend/app.py`
4. Check `components/SeabornDashboard.tsx`

### "Something broke"
1. Check browser console (F12)
2. Check backend logs
3. Read troubleshooting sections in docs
4. Check `FULL_STACK_DEPLOYMENT.md` troubleshooting

### "I want to add a new feature"
1. For frontend: Edit `components/Dashboard.tsx` or create new component
2. For backend: Add endpoint to `backend/app.py`
3. For AI: Modify `services/geminiService.ts`
4. Test locally first, then deploy

---

## 📊 Feature List

### React Dashboard (Report Canvas)
- ✅ KPI cards
- ✅ Recharts visualizations
- ✅ Data filtering
- ✅ Search functionality
- ✅ Saved insights

### Data Matrix (Explorer)
- ✅ Raw data table
- ✅ Sorting
- ✅ Searching
- ✅ Row selection

### Seaborn Stats (NEW!)
- ✅ Heatmap (correlation matrix)
- ✅ Distribution (histogram + box plot)
- ✅ Scatter (X vs Y)
- ✅ Pair Plot (multi-variable)
- ✅ Violin (group distribution)

### AI Features
- ✅ Gemini API integration
- ✅ Natural language queries
- ✅ Auto-generated insights
- ✅ Data recommendations

### Data Upload
- ✅ CSV support
- ✅ Excel support
- ✅ Schema detection
- ✅ Auto data typing

---

## 🌐 Deployment Targets

| Component | Platform | Free Tier | Instructions |
|-----------|----------|-----------|--------------|
| **React Frontend** | Vercel | ✅ Yes | [`FULL_STACK_DEPLOYMENT.md`](./FULL_STACK_DEPLOYMENT.md) |
| **Flask Backend** | Render | ✅ Yes | [`FULL_STACK_DEPLOYMENT.md`](./FULL_STACK_DEPLOYMENT.md) |
| **Alternative Backend** | Railway | ✅ Yes | [`FULL_STACK_DEPLOYMENT.md`](./FULL_STACK_DEPLOYMENT.md) |

---

## 📚 Technology Stack

### Frontend
- **Framework**: React 19.2.3
- **Build Tool**: Vite
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend
- **Framework**: Flask
- **Data**: Pandas, NumPy
- **Visualization**: Seaborn, Matplotlib
- **Server**: Gunicorn (production)
- **Language**: Python 3.9+

### AI
- **Provider**: Google Gemini
- **Package**: @google/genai

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render (or Railway)
- **Version Control**: GitHub

---

## ❓ FAQ

**Q: Can I run this without the backend?**
A: Yes! The React app alone works fine. Seaborn plots just won't work. See [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md).

**Q: Do I need to pay for anything?**
A: No! Vercel, Render, and Google Gemini API all have free tiers that cover this app.

**Q: Can I customize the Seaborn plots?**
A: Yes! Edit `backend/app.py` and modify the Seaborn styling (colors, styles, sizes).

**Q: How do I add more plot types?**
A: Add a new endpoint in `backend/app.py` and a corresponding button in `components/SeabornDashboard.tsx`.

**Q: Can I use this with a database?**
A: Yes! Modify `backend/app.py` to read from PostgreSQL, MongoDB, etc. instead of accepting CSV.

---

## 🆘 Support

- **Vercel Issues**: https://vercel.com/docs
- **Render Issues**: https://render.com/docs
- **Flask Issues**: https://flask.palletsprojects.com
- **Seaborn Issues**: https://seaborn.pydata.org
- **GitHub Issues**: Create an issue in your repo

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **Flask**: https://flask.palletsprojects.com
- **Seaborn**: https://seaborn.pydata.org
- **TypeScript**: https://www.typescriptlang.org

---

## ✨ What's Next?

1. ✅ Read [`QUICK_START.md`](./QUICK_START.md)
2. ✅ Run `python backend/run.py` + `npm run dev`
3. ✅ Test all features locally
4. ✅ Follow [`FULL_STACK_DEPLOYMENT.md`](./FULL_STACK_DEPLOYMENT.md) to deploy
5. ✅ Share with your team!

---

**Status**: ✅ Ready to deploy  
**Last Updated**: January 4, 2026  
**Maintenance**: Check documentation for updates

