# 🔥 Firebase Authentication Troubleshooting

## Current Error: `auth/api-key-not-valid`

This error means Firebase can't validate your API key. Here's how to fix it:

## Step 1: Verify Firebase Project Settings

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `credit-card-recommender-c4482`
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Find your web app or create one if it doesn't exist

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider:
   - Click on Google
   - Toggle "Enable"
   - Add your project's email as a test user
   - Save

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Done**

## Step 4: Verify API Key

Your current API key: `AIzaSyD-wkhkVwDcPFHfwrf1pBDxQ_YS29PUw8w`

If this doesn't work, get a fresh one:
1. In Project Settings → **Your apps**
2. Click on your web app
3. Copy the `apiKey` from the config object
4. Update `client/.env` file

## Step 5: Restart Development Server

```bash
cd client
npm start
```

## Alternative: Use Demo Mode

If Firebase setup is complex, we can temporarily disable authentication and focus on other features:

1. Comment out Firebase imports in components
2. Use local storage for wallet data
3. Add authentication back later

## Quick Test

Try this in your browser console (after npm start):
```javascript
// Check if Firebase is loaded
console.log(window.firebase);
```

Let me know which step you'd like to try first!
