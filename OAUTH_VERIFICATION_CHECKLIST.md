# OAuth Redirect URI - Verification Checklist

## Step 1: Verify You Can Access Google Cloud Console

1. Go to: **https://console.cloud.google.com**
2. Make sure you're signed in
3. Check if you can see the project dropdown at the top

**If you can't access Google Cloud Console:**
- You might need to be added as a project owner/member
- Contact the project owner or use the account that created the Firebase project

---

## Step 2: Verify Project Selection

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Search for: **credit-card-recommender-c4482**
3. Click on it
4. Verify the project name appears at the top

**If you don't see the project:**
- You might not have access to it
- Try using the account that created the Firebase project

---

## Step 3: Verify OAuth Client Exists

1. Go to: **APIs & Services** → **Credentials**
2. Look for section: **"OAuth 2.0 Client IDs"**
3. You should see at least one client listed

**If you see NO OAuth clients:**
- Go to Firebase Console first
- Authentication → Sign-in method → Google → Enable it
- Wait 1 minute
- Come back to Google Cloud Console
- Refresh the page

**If you see multiple clients:**
- Look for one with "Web client" in the name
- Or one that says "auto created by Firebase Service"

---

## Step 4: Verify Redirect URI is Added

1. Click on the OAuth client to edit it
2. Scroll to **"Authorized redirect URIs"**
3. Look for this EXACT line:
   ```
   https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler
   ```

**Check these things:**
- ✅ No trailing slash at the end
- ✅ Uses `https://` (not `http://`)
- ✅ Exact spelling: `firebaseapp.com` (not `firebase.com`)
- ✅ Has `/__/auth/handler` at the end

**If it's NOT there:**
- Click "+ ADD URI"
- Type it exactly: `https://credit-card-recommender-c4482.firebaseapp.com/__/auth/handler`
- Click outside the input (to save)
- Scroll down and click "SAVE"

---

## Step 5: Verify JavaScript Origins

1. In the same OAuth client, scroll to **"Authorized JavaScript origins"**
2. Should have:
   - `http://localhost:3000`
   - `https://credit-card-recommender-c4482.firebaseapp.com`

**If missing:**
- Add them using "+ ADD URI" button
- Click "SAVE"

---

## Step 6: Verify OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Make sure it says **"Configured"** (not "Not configured")
3. If not configured:
   - Select "External" (unless you have a Google Workspace)
   - Fill in required fields (App name, Support email)
   - Add your email as a test user
   - Save

---

## Step 7: Wait and Test

1. After making changes, click **"SAVE"**
2. **Wait 2-3 minutes** (changes can take time to propagate)
3. Go to: http://localhost:3000
4. **Hard refresh**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
5. Try signing in again

---

## Alternative: Try Different Sign-In Method

If it's still not working, we can try using redirect instead of popup. Let me know and I can update the code.

---

## Still Blocked? Let's Try This:

1. **Screenshot or tell me:**
   - What you see in Google Cloud Console → Credentials
   - Do you see an OAuth client?
   - What redirect URIs are currently listed?

2. **Or try this workaround:**
   - We can temporarily use email/password sign-in instead
   - Or configure Firebase to use localhost redirects only

Let me know what you see in Google Cloud Console!

