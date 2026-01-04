# 🧪 LOCAL TESTING CHECKLIST

## Start the App

### Option 1: Quick Start (Recommended)
```bash
# In PowerShell, run:
.\test-local.bat
```
This opens TWO windows automatically with both services running.

### Option 2: Manual Start (If Option 1 doesn't work)

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
```
Should show: `Running on http://127.0.0.1:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Should show: `Local: http://localhost:5173`

---

## Testing Checklist

### Phase 1: App Loads ✓
- [ ] Frontend loads at http://localhost:5173
- [ ] No JavaScript errors (check browser console F12)
- [ ] Dashboard interface visible
- [ ] All tabs visible: Report Canvas, Data Matrix, Seaborn Stats, etc.

### Phase 2: Data Upload ✓
- [ ] Click "Upload Data" button
- [ ] Select `sample_data.csv` (included in project)
- [ ] File uploads successfully
- [ ] Schema detection works (shows columns)
- [ ] Data summary displays

### Phase 3: Dashboard Features ✓
- [ ] **Report Canvas Tab**
  - [ ] KPI cards display metrics
  - [ ] Charts render properly
  - [ ] All 4 KPI cards visible
  - [ ] No errors in console

- [ ] **Data Matrix Tab**
  - [ ] Raw data table displays
  - [ ] Can search data
  - [ ] Can sort columns
  - [ ] Row selection works

- [ ] **Seaborn Stats Tab** (NEW!)
  - [ ] Tab exists and is clickable
  - [ ] Plot type buttons visible
  - [ ] Column selectors show data columns
  - [ ] "Generate Plot" button exists

### Phase 4: Seaborn Plots ✓
Test each plot type by clicking the button and waiting:

- [ ] **Heatmap** 🔥
  - [ ] Click "Generate Plot"
  - [ ] Wait 3-5 seconds
  - [ ] Image appears showing correlation matrix
  - [ ] Looks professional with colors

- [ ] **Distribution** 📊
  - [ ] Select a numeric column (e.g., "Age", "Salary")
  - [ ] Click "Generate Plot"
  - [ ] Histogram with distribution appears
  - [ ] Box plot shows alongside

- [ ] **Scatter** 📈
  - [ ] Select X column (e.g., "Age")
  - [ ] Select Y column (e.g., "Salary")
  - [ ] Click "Generate Plot"
  - [ ] Scatter plot with trend line appears

- [ ] **Pair Plot** 🔗
  - [ ] Click "Generate Plot"
  - [ ] Wait longer (5-10 seconds)
  - [ ] Multi-variable comparison grid appears

- [ ] **Violin** 🎻
  - [ ] Select X column (category, e.g., "Department")
  - [ ] Select Y column (numeric, e.g., "Salary")
  - [ ] Click "Generate Plot"
  - [ ] Violin plot comparing groups appears

### Phase 5: AI Features ✓
- [ ] **AI Chat Tab**
  - [ ] Chat interface loads
  - [ ] Can type message
  - [ ] "Send" button works
  - [ ] Gemini AI responds with insights

- [ ] **Generate Insight Button**
  - [ ] Dashboard has "Generate AI Insight" button
  - [ ] Click it
  - [ ] AI generates analysis based on data

### Phase 6: Data Features ✓
- [ ] **File Upload Works**
  - [ ] Can drag/drop CSV
  - [ ] Can browse and select CSV
  - [ ] Excel files also work (if available)

- [ ] **Data Processing**
  - [ ] Numeric columns detected
  - [ ] Categorical columns identified
  - [ ] Missing values handled gracefully

---

## Test Data

### Using Included Sample Data
File: `sample_data.csv` (20 employee records)

Columns:
- Name (text)
- Age (number)
- Salary (number)
- Years_Experience (number)
- Department (category)
- Performance_Score (number)
- Bonus_Percentage (number)

**Perfect for testing all features!**

### Or Upload Your Own CSV
- Must have at least 1 numeric column (for charts)
- Can have multiple data types
- Any size under 10MB

---

## Backend Verification

### Health Check
```bash
curl http://localhost:5000/health
```
Should return: `{"status": "ok", "timestamp": "..."}`

### API Endpoints Test
The backend provides these endpoints:
- `POST /api/plots/heatmap` - Correlation matrix
- `POST /api/plots/distribution` - Histogram + box plot
- `POST /api/plots/scatter` - Scatter with regression
- `POST /api/plots/pairplot` - Multi-variable plot
- `POST /api/plots/violin` - Violin plot
- `POST /api/analysis/summary` - Statistical summary

All working through the React UI.

---

## Expected Results

### ✅ Success Looks Like:
1. Frontend loads without errors
2. Data uploads successfully
3. Dashboard shows visualizations
4. All Seaborn plots generate properly
5. No browser console errors
6. Backend responds quickly
7. AI insights generate

### ❌ If Something Fails:
1. **Check browser console** (F12)
2. **Check backend logs** (where Flask is running)
3. **Verify `.env` file** has API key
4. **Check port conflicts** (5000, 5173)
5. See troubleshooting section below

---

## Troubleshooting

### Port Already in Use
```
Error: Address already in use: port 5173
```
**Solution:** Close other apps using ports 5000 or 5173
```bash
# Find what's using port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID [PID] /F
```

### Backend Won't Start
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:** Reinstall dependencies
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend Won't Build
```
Error: npm ERR!
```
**Solution:** Clear cache and reinstall
```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Plots Not Showing
1. Check backend is running (`http://localhost:5000/health`)
2. Check `.env` has `VITE_BACKEND_URL=http://localhost:5000`
3. Check browser console for errors
4. Verify data was uploaded correctly

### API Key Not Working
```
Error: VITE_GEMINI_API_KEY not configured
```
**Solution:** Create `.env` file in root:
```env
VITE_GEMINI_API_KEY=AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg
VITE_BACKEND_URL=http://localhost:5000
```

---

## Performance Expectations

| Feature | Time |
|---------|------|
| App loads | <3 sec |
| Data upload | <1 sec |
| Dashboard render | <2 sec |
| Heatmap plot | 3-5 sec |
| Distribution plot | 3-5 sec |
| Scatter plot | 3-5 sec |
| Pair plot | 5-10 sec |
| Violin plot | 3-5 sec |
| AI insight | 5-10 sec |

First request may be slower (30-60 sec) due to library loading.

---

## Common Issues & Fixes

### Issue: "Cannot GET /"
**Cause:** Frontend not running on port 5173
**Fix:** Run `npm run dev` in second terminal

### Issue: Plots show error image
**Cause:** Backend not responding
**Fix:** Check backend is running and `VITE_BACKEND_URL` is correct

### Issue: Data won't upload
**Cause:** File format not supported
**Fix:** Use CSV or XLSX files, not PDFs or images

### Issue: AI chat doesn't respond
**Cause:** API key invalid or network issue
**Fix:** Verify API key in `.env`, check internet connection

### Issue: High CPU usage
**Cause:** Pair plot generating (it's CPU intensive)
**Fix:** Normal - wait for it to complete

---

## Success Indicators

When everything works:
1. ✅ No red errors in browser console
2. ✅ No red errors in backend terminal
3. ✅ All tabs clickable
4. ✅ Data uploads instantly
5. ✅ Charts display properly
6. ✅ Seaborn plots generate
7. ✅ AI responds to queries
8. ✅ Fast performance (<5 sec for most operations)

---

## Next Steps After Testing

If everything works locally:
1. ✅ Read `VERCEL_DEPLOY_NOW.md`
2. ✅ Deploy React to Vercel
3. ✅ Deploy Flask to Render
4. ✅ Connect them together
5. ✅ Share production URL with team

If something doesn't work:
1. Check troubleshooting section
2. Read full stack guide
3. Check error logs carefully
4. Review configuration files

---

## Quick Reference

```bash
# Start everything
.\test-local.bat

# Manual start - Terminal 1
cd backend && python run.py

# Manual start - Terminal 2
npm run dev

# Test backend health
curl http://localhost:5000/health

# View logs
# Check PowerShell window where backend is running

# Stop
# Close both windows or Ctrl+C in each
```

---

**Ready to test?** Run `.\test-local.bat` and wait for browser to load! 🚀

