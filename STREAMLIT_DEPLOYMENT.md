# Streamlit Deployment Guide

## Local Development

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key
     ```

3. **Run locally:**
   ```bash
   streamlit run streamlit_app.py
   ```
   The app will open at `http://localhost:8501`

---

## Deploy to Streamlit Cloud

### Prerequisites:
- GitHub account with your code pushed to a public repository
- Streamlit account (sign up at https://streamlit.io/cloud)

### Steps:

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Streamlit deployment files"
   git push origin main
   ```

2. **Connect to Streamlit Cloud:**
   - Go to https://share.streamlit.io
   - Click "New app"
   - Select your GitHub repository
   - Select branch: `main`
   - Set main file path: `streamlit_app.py`

3. **Add secrets (API Key):**
   - In Streamlit Cloud dashboard, click "Settings" → "Secrets"
   - Add your secret:
     ```toml
     GEMINI_API_KEY = "your_gemini_api_key"
     ```

4. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `https://[your-username]-datasense-ai.streamlit.app`

---

## Deploy to Hugging Face Spaces (Alternative)

1. Create a Hugging Face account: https://huggingface.co
2. Create a new Space and select "Docker" template
3. Upload your files
4. Set environment variable `GEMINI_API_KEY` in Space settings
5. Your app will deploy automatically

---

## Deploy to Google Cloud Run (Advanced)

1. Create a `Dockerfile`:
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   
   CMD exec streamlit run streamlit_app.py \
     --server.port=${PORT:-8080} \
     --server.address=0.0.0.0
   ```

2. Deploy:
   ```bash
   gcloud run deploy datasense-ai \
     --source . \
     --platform managed \
     --set-env-vars GEMINI_API_KEY="your_key"
   ```

---

## Environment Variables

Required:
- `GEMINI_API_KEY` - Your Google Gemini API key

Optional:
- `STREAMLIT_SERVER_PORT` - Port to run on (default: 8501)
- `STREAMLIT_SERVER_ADDRESS` - Server address (default: localhost)

---

## Troubleshooting

**Issue:** "GEMINI_API_KEY not configured"
- **Solution:** Ensure your `.env` file has the correct API key or set it in your deployment platform's secrets

**Issue:** Dependencies not installing
- **Solution:** Make sure `requirements.txt` is in the root directory

**Issue:** Large file uploads timeout
- **Solution:** Increase Streamlit timeout in `.streamlit/config.toml`:
   ```toml
   [client]
   maxUploadSize = 1000
   ```

---

## Performance Tips

1. Cache data with `@st.cache_data` decorator
2. Use `st.spinner()` for long operations
3. Limit dataframe preview to first 10-20 rows
4. Consider pagination for large datasets

---

For more help: https://docs.streamlit.io
