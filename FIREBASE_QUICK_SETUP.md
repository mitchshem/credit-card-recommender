# 🔥 Firebase Quick Setup (5 minutes)

## Step 1: Create Firebase Project (2 min)

1. Go to https://console.firebase.google.com
2. Click **"Add Project"** or **"Create a Project"**
3. Name it: `credit-card-advisor` (or any name you like)
4. **Disable Google Analytics** (optional, can skip)
5. Click **"Create Project"**

## Step 2: Add Web App (1 min)

1. In Firebase console, click the **Web icon** `</>`
2. Register app name: `credit-card-advisor-web`
3. **Check "Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**

## Step 3: Copy Configuration (1 min)

1. You'll see a code block that looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

2. Copy these values

## Step 4: Update .env File (1 min)

Open `client/.env` and replace the placeholder values:

```env
REACT_APP_FIREBASE_API_KEY=AIza... (from firebaseConfig.apiKey)
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Enable Authentication (1 min)

1. In Firebase console, go to **Authentication** (left sidebar)
2. Click **"Get Started"**
3. Enable these providers:
   - ✅ **Email/Password** (toggle it on)
   - ✅ **Google** (click it, add your email as support email, click Save)
   - ✅ **Apple** (click it, add your email, click Save)

## Step 6: Create Firestore Database (1 min)

1. Go to **Firestore Database** (left sidebar)
2. Click **"Create Database"**
3. Select **"Start in test mode"**
4. Choose a location (pick closest to you)
5. Click **"Enable"**

## Step 7: Restart the App

```bash
cd client
# Stop the current server (Ctrl+C)
npm start
```

## ✅ Done!

Now try signing in with Google. It should work!

---

## Troubleshooting

**Error: "Firebase: Error (auth/popup-blocked)"**
- Check browser popup blocker settings
- Try clicking the link manually

**Error: "Firebase: Error (auth/unauthorized-domain)"**
- Go to Firebase Console → Authentication → Settings
- Add your domain to "Authorized domains"

**Still not working?**
- Make sure you saved `.env` file
- Restart the dev server after editing `.env`
- Check browser console for specific error messages
