# Quick Fix: OAuth Redirect URI Error

## What I Just Did

I updated the code to **automatically fall back to redirect-based sign-in** if popup fails. This should bypass the redirect URI issue.

## What Changed

- If Google Sign-In popup fails (due to OAuth policy error), it now automatically tries redirect instead
- Redirect-based sign-in doesn't require the Firebase hosting redirect URI
- The user will be redirected to Google, then back to your app

## Next Steps

1. **Restart your dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   cd client
   npm start
   ```

2. **Try signing in again:**
   - Click "Sign in with Google"
   - If you see the OAuth error, it should now automatically switch to redirect
   - You'll be taken to Google's sign-in page
   - After signing in, you'll be redirected back to your app

## Still Having Issues?

### Option 1: Verify Google Cloud Console (Recommended)

1. Go to: https://console.cloud.google.com/apis/credentials?project=credit-card-recommender-c4482
2. Find your OAuth 2.0 Client ID
3. Add these **Authorized redirect URIs**:
   - `http://localhost:3000/__/auth/handler`
   - `https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler`
4. Add these **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://credit-card-recommender-c4482.firebaseapp.com`
5. Click **SAVE**
6. Wait 2-3 minutes
7. Try again

### Option 2: Use Email/Password Sign-In (Temporary Workaround)

Until OAuth is fixed, you can use email/password sign-in:
1. Click "Sign In"
2. Click "Create Account" tab
3. Enter email and password
4. Sign in

### Option 3: Check Firebase Console

1. Go to: https://console.firebase.google.com/project/credit-card-recommender-c4482/authentication/providers
2. Click on **Google** provider
3. Make sure it's **Enabled**
4. Check that your support email is set
5. Under **Authorized domains**, make sure `localhost` is listed

## Need More Help?

Tell me:
1. What happens when you click "Sign in with Google" now?
2. Do you see any error messages in the browser console? (Press F12 to open)
3. Can you access Google Cloud Console?

