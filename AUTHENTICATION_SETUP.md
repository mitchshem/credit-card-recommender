# Authentication System Setup Guide

## What's Been Implemented

✅ **Complete Firebase Authentication System**
- Google Sign-In
- Apple Sign-In  
- Email/Password authentication
- User profile management with Firestore
- Modern authentication modal UI
- Protected routes and user state management

## Firebase Setup Required

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Name it "credit-card-advisor" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication" → "Get Started"
2. Enable these providers:
   - **Email/Password** (toggle on)
   - **Google** (add your support email, save)
   - **Apple** (add your support email, save)

### Step 3: Get Configuration Values
1. Go to "Project Settings" (gear icon)
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app name: "credit-card-advisor-web"
5. Copy the `firebaseConfig` object

### Step 4: Configure Environment Variables
1. In `client/` folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Paste your Firebase config values into `.env`:
   ```env
   REACT_APP_FIREBASE_API_KEY=paste-your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=paste-your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=paste-your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=paste-your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=paste-your-sender-id
   REACT_APP_FIREBASE_APP_ID=paste-your-app-id
   ```

### Step 5: Create Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create Database"
3. Select "Start in test mode" (for now)
4. Choose a location closest to your users
5. Click "Enable"

### Step 6: Set Firestore Rules (Important!)
1. Go to "Firestore Database" → "Rules"
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click "Publish"

## Running the App

```bash
cd client
npm start
```

The app will run at `http://localhost:3000`

## Features

### Authentication Methods
- **Google Sign-In**: One-click OAuth sign-in
- **Apple Sign-In**: Native Apple authentication
- **Email/Password**: Traditional email registration

### User Profile
- Stores in Firestore: `users/{userId}`
- Profile data: name, email, photoURL
- Wallet cards stored per user
- Preferences and settings

### UI Components
- Modern glassmorphism auth modal
- Automatic user avatar display
- Smooth login/logout transitions
- User menu dropdown with profile actions

## Next Steps

1. Test authentication with all three methods
2. Add password reset functionality
3. Implement email verification
4. Add user profile editing
5. Enhance security rules for production

## Troubleshooting

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Check that your `.env` file exists and has correct values
- Restart the dev server after editing `.env`

**Error: "Firebase: Error (auth/popup-blocked)"**
- Check browser popup blocker settings
- Ensure domain is added to Firebase authorized domains

**Users can't sign in with Google/Apple**
- Verify providers are enabled in Firebase Console
- Check that support email is configured
- Ensure app domain is added to authorized domains

For more help, see: https://firebase.google.com/docs/auth
