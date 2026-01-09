# Fix Google OAuth Redirect URI Error

## The Problem

You're seeing this error:
```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
redirect_uri=https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
```

This means the redirect URI needs to be registered in Google Cloud Console.

---

## Quick Fix (5 minutes)

### Step 1: Open Google Cloud Console

1. Go to: https://console.cloud.google.com
2. Make sure you're signed in with the same Google account as Firebase
3. Select your project: **credit-card-recommender-c4482**
   - If you don't see it, click the project dropdown at the top
   - Search for "credit-card-recommender"

### Step 2: Find Your OAuth Client

1. In the left sidebar, go to **"APIs & Services"** → **"Credentials"**
2. Look for **"OAuth 2.0 Client IDs"** section
3. You should see a client named something like:
   - "Web client" or
   - "Web client (auto created by Firebase Service)" or
   - A client with your Firebase project name

4. **Click on that OAuth client** to edit it

### Step 3: Add Redirect URIs

In the OAuth client configuration, find the section **"Authorized redirect URIs"** and add these URIs:

#### For Development (Local Testing):
```
http://localhost:3000/__/auth/handler
http://localhost:3000
```

#### For Firebase Hosting (Production):
```
https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
```

#### Complete List (Add All of These):
1. `http://localhost:3000/__/auth/handler`
2. `http://localhost:3000`
3. `https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler`

**Important**: 
- Click **"ADD URI"** button for each one
- Make sure there are NO trailing slashes
- URLs are case-sensitive

### Step 4: Also Check Authorized JavaScript Origins

In the same OAuth client configuration, find **"Authorized JavaScript origins"** and make sure these are added:

1. `http://localhost:3000`
2. `https://credit-card-recommender-c4482.firebaseapp.com`

**Important**:
- No trailing slashes
- Must include `http://` or `https://`

### Step 5: Save

1. Click **"SAVE"** button at the bottom
2. Wait a few seconds for changes to propagate

### Step 6: Test Again

1. Go back to your app: http://localhost:3000
2. Hard refresh the page: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Try signing in with Google again

---

## Alternative: Let Firebase Configure It Automatically

If you can't find the OAuth client or want Firebase to handle it:

### Option A: Use Firebase Console

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: **credit-card-recommender-c4482**
3. Go to **"Authentication"** → **"Sign-in method"**
4. Click on **"Google"** provider
5. Make sure it's **"Enabled"**
6. Click **"Save"**

Firebase should automatically configure the OAuth client for you.

### Option B: Add Domain in Firebase

1. In Firebase Console, go to **"Authentication"** → **"Settings"** tab
2. Scroll to **"Authorized domains"**
3. Make sure these domains are listed:
   - `localhost` (should be there by default)
   - Your custom domain (if you have one)

---

## Still Not Working?

### Check These Common Issues:

1. **Wrong Project Selected**
   - Make sure you're in the correct Google Cloud project
   - The project ID should match: `credit-card-recommender-c4482`

2. **OAuth Consent Screen Not Configured**
   - Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Make sure it's configured (at least in Testing mode)
   - Add your email as a test user

3. **API Not Enabled**
   - Go to **"APIs & Services"** → **"Library"**
   - Search for "Google+ API" or "Identity Toolkit API"
   - Make sure they're enabled

4. **Browser Cache**
   - Clear your browser cache
   - Try incognito/private browsing mode
   - Hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`

---

## Quick Visual Guide

```
Google Cloud Console
├── Select Project: credit-card-recommender-c4482
├── APIs & Services
│   ├── Credentials
│   │   └── OAuth 2.0 Client IDs
│   │       └── [Click on your Web client]
│   │           ├── Authorized JavaScript origins:
│   │           │   ✓ http://localhost:3000
│   │           │   ✓ https://credit-card-recommender-c4482.firebaseapp.com
│   │           │
│   │           └── Authorized redirect URIs:
│   │               ✓ http://localhost:3000/__/auth/handler
│   │               ✓ http://localhost:3000
│   │               ✓ https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
```

---

## Test It

After adding the URIs:

1. Save in Google Cloud Console
2. Wait 1-2 minutes for changes to propagate
3. Go to: http://localhost:3000
4. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
5. Click "Sign In" → "Sign in with Google"
6. Should work now! ✅

---

## Need More Help?

If it's still not working:
1. Check the browser console for specific error messages
2. Verify your Firebase project ID matches everywhere
3. Make sure you're using the same Google account for Firebase and Cloud Console
4. Try creating a new OAuth client if the existing one seems broken

Let me know what error you see after following these steps!

