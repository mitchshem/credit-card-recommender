# 🔥 Firebase Setup - Step by Step Guide

## What Just Happened?

Firebase gave you installation instructions for the CLI tools. **You don't need those** for this React app.

## What You Actually Need to Do

### Step 1: Get Your Firebase Config Values ✅

1. In Firebase Console, you should see a code block that looks like this:

```javascript
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
  // ... more imports

  const firebaseConfig = {
    apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "your-project-12345.firebaseapp.com",
    projectId: "your-project-12345",
    storageBucket: "your-project-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
  };

  const app = initializeApp(firebaseConfig);
</script>
```

2. **Copy these values** from the `firebaseConfig` object
3. **You do NOT need to copy the import/initialize code** - that's for a different setup

### Step 2: Update Your .env File

Open the file: `client/.env`

You'll see something like this:
```
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
...
```

Replace the values like this:
```
REACT_APP_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-12345.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### Step 3: Ignore the Firebase CLI Code

**You can SKIP the code Firebase gave you** (`npm install firebase`, `firebase login`, etc.)

Our React app already has Firebase installed and configured. You just need the config values.

### Step 4: Enable Authentication

1. In Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get Started"**
3. Click the **"Sign-in method"** tab
4. Enable **Google** (click on it, add your email, save)
5. Enable **Email/Password** (toggle it on)

### Step 5: Create Firestore Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create Database"**
3. Select **"Start in test mode"**
4. Pick a location
5. Click **"Enable"**

### Step 6: Restart Your App

```bash
# In the client folder
cd client
# Stop current server (Ctrl+C)
npm start
```

## That's It!

Once you've done this, Google Sign-In will work.

---

## Quick Reference: What to Copy

From Firebase Console, you need these 6 values:

1. `apiKey` → `REACT_APP_FIREBASE_API_KEY`
2. `authDomain` → `REACT_APP_FIREBASE_AUTH_DOMAIN`
3. `projectId` → `REACT_APP_FIREBASE_PROJECT_ID`
4. `storageBucket` → `REACT_APP_FIREBASE_STORAGE_BUCKET`
5. `messagingSenderId` → `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
6. `appId` → `REACT_APP_FIREBASE_APP_ID`

That's all you need! The React app code is already set up.
