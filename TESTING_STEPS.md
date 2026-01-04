# 🧪 LOCAL TESTING - START HERE

## ✅ Everything is Ready!

Your app is fully built and ready to test locally. All dependencies are configured.

---

## 🚀 TO TEST LOCALLY - 2 OPTIONS

### **Option 1: EASIEST - Run This Command**

Open PowerShell in your project folder and run:

```powershell
.\test-local.bat
```

This automatically opens 2 windows:
- Window 1: Flask backend (port 5000)
- Window 2: React frontend (port 5173)

Browser should open automatically! Then proceed to "Testing Steps" below.

---

### **Option 2: MANUAL - Run in Two Separate Windows**

**Window 1 - Backend:**
```bash
cd backend
python run.py
```
Wait for: `Running on http://127.0.0.1:5000`

**Window 2 - Frontend (new PowerShell window):**
```bash
npm run dev
```
Wait for: `Local: http://localhost:5173` and browser opens

---

## 🧪 Testing Steps (Same for Both Options)

### 1. **Wait for App to Load**
   - Frontend: Allow 30-60 seconds for first build
   - You'll see "Local: http://localhost:5173" in terminal
   - Browser should auto-open

### 2. **Upload Test Data**
   - Click "Upload Data" button
   - Select: `sample_data.csv` (in your project folder)
   - File should upload successfully ✓

### 3. **Test Dashboard Features**
   - **Report Canvas Tab** → See charts and KPI cards
   - **Data Matrix Tab** → See raw data table
   - Both should display without errors ✓

### 4. **Test Seaborn Plots** (NEW!)
   - Click **"Seaborn Stats"** tab
   - Click **"🔥 Heatmap"** button
   - Wait 3-5 seconds
   - **Correlation matrix image appears** ✓
   
   - Click **"📊 Distribution"** button
   - Select a column (e.g., "Age" or "Salary")
   - Wait 3-5 seconds
   - **Histogram appears** ✓
   
   - Try **"📈 Scatter"**, **"🔗 Pair Plot"**, **"🎻 Violin"** the same way
   - All should generate beautiful Seaborn plots

### 5. **Test AI Features**
   - Click **"Neural Chat"** tab
   - Type a question (e.g., "What are the salary trends?")
   - AI should respond with insights ✓

### 6. **Check Console for Errors**
   - Press **F12** in browser
   - Look at Console tab
   - Should be empty or just info messages (no red errors)

---

## ✨ What Success Looks Like

✅ App loads without errors
✅ Data uploads in <1 second
✅ Dashboard shows charts
✅ All tabs are clickable
✅ Seaborn plots generate (3-10 seconds each)
✅ AI responds to queries
✅ No red errors in browser console

---

## ❌ If Something Goes Wrong

### "Port Already in Use"
```powershell
# Find what's using the port
netstat -ano | findstr :5173

# Kill it (replace [PID] with the number shown)
taskkill /PID [PID] /F

# Then retry
```

### "No module named 'flask'"
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### "npm: command not found"
Node.js might not be installed. Check:
```bash
node --version  # Should show v24.x.x
npm --version   # Should show 10.x.x
```

### "Plots not showing"
1. Make sure backend window is running (not crashed)
2. Check `.env` file has:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   VITE_GEMINI_API_KEY=AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg
   ```
3. Restart both services

### "API key error"
Create/edit `.env` in your project root:
```env
VITE_GEMINI_API_KEY=AIzaSyAZyeiVStz9UNnEb_klkXaqxEq2O_YRtMg
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🔗 Test URLs

- **Frontend:** http://localhost:5173
- **Backend Health Check:** http://localhost:5000/health
- Should return: `{"status": "ok", ...}`

---

## 📊 Sample Data Included

File: `sample_data.csv`
Contains: 20 employee records with:
- Name, Age, Salary, Department
- Years Experience, Performance Score, Bonus %

Perfect for testing!

---

## ⏱️ Expected Times

- **First startup:** 1-2 minutes (libraries load)
- **App ready:** Then instant
- **Data upload:** <1 second
- **Dashboard render:** 1-2 seconds
- **Seaborn plots:** 3-10 seconds (depending on plot type)
- **AI response:** 5-10 seconds

---

## 🎯 Testing Checklist

```
☐ Run .\test-local.bat (or manual commands)
☐ Wait for "Running on..." messages
☐ Browser opens with app
☐ Upload sample_data.csv
☐ View Report Canvas (charts visible)
☐ View Data Matrix (table visible)
☐ Click Seaborn Stats tab
☐ Click Heatmap button (plot appears)
☐ Click Distribution button (plot appears)
☐ Click other plot buttons (all work)
☐ Try Neural Chat (AI responds)
☐ Check browser console (F12) - no red errors
☐ All tests pass ✅
```

---

## 📚 More Help

- **Detailed testing guide:** `LOCAL_TESTING.md`
- **Quick reference:** `TESTING_QUICK_REF.txt`
- **Full docs:** `INDEX.md`
- **Troubleshooting:** `FULL_STACK_DEPLOYMENT.md`

---

## ✅ After Testing Works

If everything looks good locally:

1. Read: `VERCEL_DEPLOY_NOW.md`
2. Go to: https://vercel.com/new
3. Deploy: Your app
4. Get: Live URL
5. Share: With your team! 🎉

---

## 🚀 Ready?

Run this command now:

```powershell
.\test-local.bat
```

Or manually in two windows:

```bash
# Window 1
cd backend
python run.py

# Window 2 (new window)
npm run dev
```

Enjoy testing your DataSense AI app! 🧪✨

