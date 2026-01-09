# Firebase Deployment & Setup Guide

## Quick Start Checklist

### 1. Firebase Console Setup

- [x] Firebase project created
- [ ] Authentication enabled (Google Sign-In)
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Environment variables configured

### 2. Enable Google Sign-In

1. Go to Firebase Console > Authentication > Sign-in method
2. Click on "Google"
3. Enable Google Sign-In
4. Add your project's support email
5. Save

### 3. Create Firestore Database

1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Choose "Start in production mode" (we'll add rules next)
4. Select a location (choose closest to your users)
5. Click "Enable"

### 4. Deploy Security Rules

#### Option A: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   cd /path/to/your/project
   firebase init firestore
   ```
   - Select your Firebase project
   - Use the existing `firestore.rules` file
   - Don't overwrite existing rules

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

#### Option B: Using Firebase Console

1. Go to Firebase Console > Firestore Database > Rules
2. Copy the contents of `firestore.rules` from this project
3. Paste into the rules editor
4. Click "Publish"

### 5. Configure Environment Variables

1. Create `.env` file in `client/` directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key-here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

2. Get these values from:
   - Firebase Console > Project Settings > General > Your apps
   - Or click the gear icon next to "Project Overview"

3. **Important**: Never commit `.env` to version control!
   - Add `.env` to `.gitignore`

### 6. Test Your Setup

1. **Start your development server**:
   ```bash
   cd client
   npm start
   ```

2. **Test Google Sign-In**:
   - Click "Sign In" button
   - Select "Sign in with Google"
   - Complete the sign-in flow
   - Verify you're signed in

3. **Test Firestore**:
   - After signing in, check Firebase Console > Firestore Database
   - You should see a `users` collection
   - You should see a document with your user ID

4. **Test Security Rules**:
   - In Firebase Console > Firestore Database > Rules
   - Use "Rules Playground" to test:
     - Try reading your own document: ✅ Should allow
     - Try reading another user's document: ❌ Should deny

### 7. Verify Security Rules Work

1. Open Firebase Console > Firestore Database > Rules
2. Click "Rules Playground"
3. Set up a test:
   - Collection: `users`
   - Document ID: `test-user-id`
   - Authenticated: Yes
   - UID: `test-user-id`
   - Operation: Read
4. Run test - should show "Allow"
5. Try with different UID - should show "Deny"

## Troubleshooting

### "Firebase: Error (auth/api-key-not-valid)"

**Problem**: API key is invalid or missing

**Solution**:
1. Check `.env` file exists in `client/` directory
2. Verify all environment variables start with `REACT_APP_`
3. Restart your development server after changing `.env`
4. Verify config values in Firebase Console

### "Missing or insufficient permissions"

**Problem**: Security rules are blocking access

**Solution**:
1. Check Security Rules are deployed correctly
2. Verify rules allow authenticated users to read/write their own documents
3. Check that user is signed in (`currentUser` is not null)
4. Verify document ID matches user's `uid`

### "User document not found"

**Problem**: User profile doesn't exist in Firestore

**Solution**:
1. Sign out and sign back in (triggers profile creation)
2. Check Firebase Console for errors
3. Verify `createUserProfile` or `createOrUpdateUserProfile` is being called

### Google Sign-In popup blocked

**Problem**: Browser blocks popup

**Solution**:
1. Allow popups for your domain
2. Check browser console for errors
3. Try a different browser
4. Verify OAuth configuration in Firebase Console

## Production Deployment

### Before Going Live

1. **Update Security Rules**: Review and tighten rules for production
2. **Set Up Domain**: Add your production domain to Firebase authorized domains
3. **Configure OAuth**: Update OAuth redirect URIs for production domain
4. **Environment Variables**: Set up production environment variables
5. **Error Monitoring**: Set up Firebase Crashlytics or error tracking

### Environment Variables in Production

For production deployment platforms (Vercel, Netlify, etc.):

1. Go to your platform's environment variables settings
2. Add all `REACT_APP_*` variables
3. Redeploy your app

**Never** hard-code Firebase config in your source code!

## Security Checklist

- [ ] Security Rules deployed and tested
- [ ] Environment variables configured (not in source code)
- [ ] `.env` file in `.gitignore`
- [ ] HTTPS enabled (automatic in production)
- [ ] No sensitive data logged to console in production
- [ ] OAuth redirect URIs configured correctly
- [ ] Firestore indexes created (if needed for queries)

## Next Steps

1. ✅ Complete setup checklist above
2. ✅ Test authentication flow
3. ✅ Test reading/writing user data
4. ✅ Review Security Rules
5. ✅ Plan for additional collections (wallets, cards, etc.)

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)

