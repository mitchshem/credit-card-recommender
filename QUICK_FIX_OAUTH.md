# Quick Fix: Google OAuth Redirect URI Error

## The Problem

Error: `redirect_uri=https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler` is not registered.

## Fix in 3 Steps

### Step 1: Open Google Cloud Console (30 seconds)

1. Go to: **https://console.cloud.google.com**
2. Make sure you're logged in with the same Google account as Firebase
3. At the top, click the **project dropdown** (shows current project name)
4. Select: **credit-card-recommender-c4482**

### Step 2: Find OAuth Client (1 minute)

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"**
3. Under **"OAuth 2.0 Client IDs"**, you'll see one or more clients
4. Look for one named like:
   - "Web client (auto created by Firebase Service)"
   - Or just "Web client"
5. **Click on it** to edit

### Step 3: Add Redirect URIs (2 minutes)

In the edit screen, you'll see two sections:

#### A. Authorized JavaScript origins
Click **"+ ADD URI"** and add:
- `http://localhost:3000`
- `https://credit-card-recommender-c4482.firebaseapp.com`

#### B. Authorized redirect URIs
Click **"+ ADD URI"** and add these THREE:
1. `http://localhost:3000/__/auth/handler`
2. `http://localhost:3000`
3. `https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler`

**Important**: 
- ✅ No trailing slashes
- ✅ Exact spelling
- ✅ Include `http://` or `https://`

#### C. Click "SAVE" button at the bottom

### Step 4: Test (30 seconds)

1. Wait 30 seconds for changes to apply
2. Go back to: **http://localhost:3000**
3. Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
4. Try signing in with Google again

---

## Visual Guide

```
Google Cloud Console
│
├─ Select Project: credit-card-recommender-c4482
│
└─ APIs & Services
   └─ Credentials
      └─ OAuth 2.0 Client IDs
         └─ [Click "Web client"]
            │
            ├─ Authorized JavaScript origins
            │  ✓ http://localhost:3000
            │  ✓ https://credit-card-recommender-c4482.firebaseapp.com
            │
            └─ Authorized redirect URIs
               ✓ http://localhost:3000/__/auth/handler
               ✓ http://localhost:3000
               ✓ https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
```

---

## Can't Find OAuth Client?

If you don't see an OAuth client:

1. Go back to **Firebase Console**: https://console.firebase.google.com
2. Select project: **credit-card-recommender-c4482**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google**
5. Make sure it says **"Enabled"**
6. Click **Save** (even if nothing changed)
7. Go back to Google Cloud Console and refresh - the client should appear

---

## Still Not Working?

Try this alternative:

### Quick Alternative: Use Localhost Only

1. In OAuth client settings, make sure `http://localhost:3000/__/auth/handler` is in redirect URIs
2. Remove the Firebase hosting URI temporarily
3. Test with localhost first
4. Add Firebase URI back later

---

**After adding URIs and saving, wait 30 seconds, then try again!** 🚀

