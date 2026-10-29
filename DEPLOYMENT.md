# FoodVerse AI – Production Deployment Guide

This guide outlines deployment instructions for hosting FoodVerse AI across cloud and edge platforms, including frontend hosting (Vercel / Netlify), backend container hosting (Render / Railway / Fly.io), and persistent volume storage.

---

## 1. Frontend Deployment (Vercel or Netlify)

The React 18 / Vite PWA frontend can be deployed statically to Vercel, Netlify, or Cloudflare Pages with zero server costs.

### Vercel Deployment
1. Connect your GitHub repository (`foodverse-ai`) to [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Configure Environment Variables in Vercel:
   ```env
   VITE_API_BASE_URL=https://your-backend-service.onrender.com
   ```
4. Click **Deploy**. Single-page application (SPA) routing is handled automatically.

### Netlify Deployment
1. Create a `_redirects` file in `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```
2. In Netlify dashboard:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Environment variables**: Add `VITE_API_BASE_URL`.

---

## 2. Backend Deployment (Render or Railway)

The FastAPI backend runs as a containerized Python service.

### Option A: Render.com (Web Service)
1. In Render, select **New > Web Service** and connect the repository.
2. Configure settings:
   - **Root Directory**: Leave blank or set to `backend`
   - **Environment**: `Docker` (Render automatically uses `Dockerfile.backend`) or `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   ```env
   ENVIRONMENT=production
   DEBUG=false
   SECRET_KEY=generate-a-strong-random-key-here
   DEMO_MODE=false
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
   ALLOWED_ORIGINS=https://foodverse-frontend-l1bc.onrender.com,http://localhost:5173
   DATABASE_URL=sqlite:///./backend/data/foodverse.db
   FOOD_DATABASE_PATH=./backend/data/food_database.sqlite
   STORAGE_TYPE=local
   UPLOAD_DIR=./storage/uploads
   ```

   > [!IMPORTANT]
   > **AI Multimodal Vision Activation**: To analyze custom uploaded videos in Hygiene Monitor and arbitrary custom food images in Food Recognition, set `AI_PROVIDER=gemini` and supply your `GEMINI_API_KEY` (from [Google AI Studio](https://aistudio.google.com/)). If left unconfigured, FoodVerse AI safely uses the verified offline deterministic provider and provides 5 bundled demonstration plates with authentic bounding boxes and real OpenCV video frame processing without fabricating outputs.
4. **Persistent Disk Note**: On Render, add a **Persistent Disk** mounted at `/app/backend/data` and `/app/storage/uploads` if you want user history and uploaded images to persist across dyno restarts.

### Option B: Railway.app
1. In Railway, click **New Project > Deploy from GitHub repo**.
2. Set Root Directory to `/backend` or use the root `Dockerfile.backend`.
3. Add a persistent volume under **Settings > Volumes** and mount it to `/app/backend/data`.
4. Add your production environment variables.

---

## 3. Docker Compose on VPS / Cloud VM (AWS EC2 / DigitalOcean)

To host both frontend and backend on a virtual private server:
1. SSH into your server:
   ```bash
   git clone https://github.com/anshikag0905/foodverse-ai.git
   cd foodverse-ai
   cp .env.example .env
   ```
2. Update `.env` with your domain and production secrets.
3. Start the containers in background:
   ```bash
   docker compose up -d --build
   ```
4. Set up an Nginx reverse proxy with Certbot SSL:
   ```nginx
   # Frontend
   server {
       server_name foodverse.yourdomain.com;
       location / {
           proxy_pass http://127.0.0.1:5173;
       }
   }

   # Backend API
   server {
       server_name api.foodverse.yourdomain.com;
       location / {
           proxy_pass http://127.0.0.1:8000;
           client_max_body_size 50M;
       }
   }
   ```
