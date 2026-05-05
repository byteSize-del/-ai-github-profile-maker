# Google OAuth Setup Guide

This guide explains how to configure Google OAuth authentication for the AI GitHub Profile Maker.

## Prerequisites

- Supabase project created and configured
- Google Cloud Project with OAuth 2.0 credentials
- Backend and frontend deployed or running locally

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add Authorized Redirect URIs:
     - Development: `http://localhost:4000/api/auth/callback/google`
     - Development Frontend: `http://localhost:5173/login` (for Google's redirect)
     - Production Backend: `https://your-backend.com/api/auth/callback/google`
     - Production Frontend: `https://your-frontend.com/login`
   - Save the Client ID and Client Secret

## Step 2: Update Backend Environment Variables

Add to `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/callback/google  # For development
# For production:
# GOOGLE_CALLBACK_URL=https://your-backend.com/api/auth/callback/google
```

## Step 3: Verify Backend Routes

The following endpoints are now available:

- `GET /api/auth/oauth-state?provider=github|google` - Get OAuth state token
- `GET /api/auth/google/url` - Get Google authorization URL
- `POST /api/auth/callback` - GitHub OAuth callback
- `POST /api/auth/callback/google` - Google OAuth callback

## Step 4: Update Frontend Environment Variables

No additional frontend environment variables needed for Google OAuth, but ensure these are set:

```env
VITE_API_URL=http://localhost:4000  # Development
# For production:
# VITE_API_URL=https://your-backend.com
```

## Step 5: Database Schema

The Google auth implementation expects the following columns in the `users` table:

```sql
-- New columns to add if not present:
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

## Step 6: Test the Integration

1. Start the backend: `npm run dev`
2. Start the frontend: `npm run dev`
3. Go to `http://localhost:5173/login`
4. Click "Continue with Google"
5. Authorize the application
6. You should be redirected to the dashboard

## Troubleshooting

### "Failed to initialize Google OAuth"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Verify the backend is running and accessible

### "Authentication failed"
- Check browser console for detailed error messages
- Verify redirect URIs match exactly in Google Cloud Console
- Check backend logs for OAuth errors

### "Invalid state parameter - CSRF detected"
- Clear cookies and try again
- Check that cookies are enabled in your browser
- Verify `BACKEND_URL` or `GOOGLE_CALLBACK_URL` is correctly set

### OAuth state cookie not set
- Ensure backend and frontend have matching `SameSite` cookie settings
- In production, verify HTTPS is being used
- Check CORS configuration matches your frontend URL

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase OAuth Documentation](https://supabase.io/docs/guides/auth)
- [Express.js OAuth Integration Guide](https://expressjs.com/en/guide/behind-proxies.html)

## Security Notes

- Always use HTTPS in production
- Never commit `.env` files with credentials
- Rotate credentials if they're exposed
- Use different credentials for development and production
- Implement rate limiting on auth endpoints (already configured in this project)
- Use httpOnly cookies for storing session tokens (already implemented)
