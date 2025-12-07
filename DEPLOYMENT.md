# Deployment Guide - Cricktz

This guide will help you deploy Cricktz to production.

## Architecture

- **Frontend**: React + TypeScript + Vite (Deploy to Netlify)
- **Backend**: Node.js + Express + Socket.io (Deploy to Render or Railway)

## Backend Deployment

### Option 1: Deploy to Render

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure:
     - **Name**: cricket-game-backend
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Deploy**: Click "Create Web Service"

4. **Get Backend URL**: After deployment, copy your backend URL (e.g., `https://cricket-game-backend.onrender.com`)

### Option 2: Deploy to Railway

1. **Create Account**: Sign up at [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Configure:
     - **Root Directory**: `backend`
     - Railway auto-detects Node.js

3. **Deploy**: Railway will automatically deploy

4. **Get Backend URL**: Copy your backend URL from the Railway dashboard

## Frontend Deployment

### Deploy to Netlify

1. **Update Backend URL**:
   - Open `.env` file
   - Update `VITE_SOCKET_URL` with your backend URL:
     ```
     VITE_SOCKET_URL=https://your-backend-url.onrender.com
     ```

2. **Build Frontend**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   - Sign up at [netlify.com](https://netlify.com)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder
   - OR connect your Git repository for automatic deployments

4. **Configure Build Settings** (if using Git):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add `VITE_SOCKET_URL` with your backend URL

## Post-Deployment Configuration

### Update CORS in Backend

1. Open `backend/server.js`
2. Update the `allowedOrigins` array with your Netlify domain:
   ```javascript
   const allowedOrigins = [
     'http://localhost:5173',
     'https://your-app.netlify.app'
   ];
   ```
3. Commit and push changes (or redeploy on Render/Railway)

## Testing

1. Open your Netlify URL
2. Create a room
3. Open another browser/device
4. Join the room with the room code
5. Play a complete match

## Troubleshooting

### Connection Issues

- Check that `VITE_SOCKET_URL` in frontend matches your backend URL
- Verify CORS settings in backend include your frontend domain
- Check browser console for connection errors

### Backend Not Responding

- Check backend logs on Render/Railway
- Verify the backend is running (visit the health endpoint: `https://your-backend-url/health`)
- Ensure the PORT environment variable is set correctly

### Room Join Errors

- Verify both players are connected to the same backend
- Check that room codes are entered correctly (case-sensitive)
- Ensure backend is not restarting (free tier services may sleep)

## Free Tier Limitations

- **Render Free**: Services may sleep after 15 minutes of inactivity
- **Railway Free**: Limited hours per month
- **Netlify Free**: Unlimited bandwidth for personal projects

## Production Recommendations

For production use:
1. Upgrade to paid tiers for better reliability
2. Add database persistence for game history
3. Implement reconnection logic for disconnected players
4. Add authentication for player accounts
5. Implement rate limiting and security measures
