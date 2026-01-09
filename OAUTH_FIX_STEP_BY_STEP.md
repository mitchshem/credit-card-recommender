# Fix OAuth Redirect URI - Step by Step

## The Error
```
redirect_uri=https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
```

This URI needs to be registered in Google Cloud Console.

---

## Step-by-Step Fix

### Step 1: Open Google Cloud Console
1. Go to: **https://console.cloud.google.com**
2. Sign in with the same Google account you use for Firebase

### Step 2: Select Your Project
1. At the top of the page, click the **project dropdown** (shows current project name)
2. Type or search for: **credit-card-recommender-c4482**
3. Click on it to select

### Step 3: Navigate to OAuth Credentials
1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"** (should be highlighted)
3. You'll see a section called **"OAuth 2.0 Client IDs"**

### Step 4: Find Your OAuth Client
Look for a client with one of these names:
- "Web client (auto created by Firebase Service)"
- "Web client"
- Or something with your project name

**If you don't see any OAuth clients:**
- Go to Firebase Console first
- Authentication → Sign-in method → Google → Enable it
- Then come back to Google Cloud Console

### Step 5: Edit the OAuth Client
1. **Click on the OAuth client** to open it
2. You'll see a form with several fields

### Step 6: Add Authorized JavaScript Origins
Scroll to **"Authorized JavaScript origins"** section:
1. Click **"+ ADD URI"** button
2. Add: `http://localhost:3000`
3. Click **"+ ADD URI"** again
4. Add: `https://credit-card-recommender-c4482.firebaseapp.com`

**Important**: 
- No trailing slashes
- Must include `http://` or `https://`
- One URI per line

### Step 7: Add Authorized Redirect URIs
Scroll to **"Authorized redirect URIs"** section:
1. Click **"+ ADD URI"** button
2. Add: `http://localhost:3000/__/auth/handler`
3. Click **"+ ADD URI"** again
4. Add: `http://localhost:3000`
5. Click **"+ ADD URI"** again
6. Add: `https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler`

**This is the one from your error!** Make sure it's added exactly as shown.

### Step 8: Save
1. Scroll to the bottom of the page
2. Click the blue **"SAVE"** button
3. Wait for the "Saved" confirmation message

### Step 9: Wait and Test
1. **Wait 30-60 seconds** for changes to propagate
2. Go back to your app: **http://localhost:3000**
3. **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. Try signing in with Google again

---

## What Your OAuth Client Should Look Like

After adding everything, you should have:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://credit-card-recommender-c4482.firebaseapp.com
```

**Authorized redirect URIs:**
```
http://localhost:3000/__/auth/handler
http://localhost:3000
https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
```

---

## Alternative: If You Can't Find the OAuth Client

### Option 1: Let Firebase Create It
1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select project: **credit-card-recommender-c4482**
3. Go to **Authentication** → **Sign-in method**
4. Click on **"Google"**
5. Make sure it's **"Enabled"**
6. Click **"Save"** (even if nothing changed)
7. Go back to Google Cloud Console → Credentials
8. The OAuth client should now appear

### Option 2: Create New OAuth Client
1. In Google Cloud Console → APIs & Services → Credentials
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Application type: **"Web application"**
5. Name: **"Firebase Web Client"**
6. Add the JavaScript origins and redirect URIs as shown above
7. Click **"CREATE"**

---

## Still Not Working?

### Check These:

1. **OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Make sure it's configured (at least in "Testing" mode)
   - Add your email as a test user

2. **APIs Enabled**
   - Go to **APIs & Services** → **Library**
   - Search for "Identity Toolkit API"
   - Make sure it's enabled

3. **Browser Cache**
   - Clear browser cache
   - Try incognito/private mode
   - Hard refresh: `Cmd+Shift+R` or `Ctrl+Shift+R`

4. **Wait Longer**
   - Sometimes changes take 2-3 minutes to propagate
   - Try again after waiting

---

## Quick Checklist

- [ ] Opened Google Cloud Console
- [ ] Selected project: credit-card-recommender-c4482
- [ ] Found OAuth 2.0 Client ID
- [ ] Added `http://localhost:3000` to JavaScript origins
- [ ] Added `https://credit-card-recommender-c4482.firebaseapp.com` to JavaScript origins
- [ ] Added `http://localhost:3000/__/auth/handler` to redirect URIs
- [ ] Added `http://localhost:3000` to redirect URIs
- [ ] Added `https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler` to redirect URIs
- [ ] Clicked SAVE
- [ ] Waited 30-60 seconds
- [ ] Hard refreshed browser
- [ ] Tried signing in again

---

**After completing these steps, the OAuth error should be fixed!** ✅

