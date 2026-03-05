# Smoke Test Checklist

## Preconditions
1. From repo root, run `cd client && npm install` (if dependencies are not already installed).
2. Start app with `npm start` in `client/` and open `http://localhost:3000`.
3. Use a clean browser session (Incognito or clear localStorage) for a deterministic run.

## 1) Wallet Setup Flow
1. Open the left nav and click **Wallet**.
2. Confirm at least one card tile is visible.
3. Click **Activate** on one Visa or Mastercard and one additional card.
4. Click each activated card and verify the detail modal opens, then close it.
5. Refresh the browser.
6. Return to **Wallet** and confirm activation state persisted.

Expected result:
- Activated cards remain active after refresh.
- Wallet page loads without UI errors.

## 2) Merchant Recommendation Flow
1. Click **Advisor**.
2. Click **Dining** in Quick Categories.
3. Verify a recommendation result appears with:
- `Recommended Card` hero
- `Why this card?` section
- optional `Runner-ups` section
4. Click **Warehouse** (or **Costco**) and verify recommendation still appears without Amex-only selection issues.
5. Confirm **Offers (Coming Soon)** section is visible with two placeholder cards and disclaimer text.

Expected result:
- Recommendation updates immediately per category.
- Offers placeholder is always visible on Advisor.

## 3) Usage Tracking Flow (MVP Manual)
1. Click **Upgrade Guide**.
2. Verify the checklist renders and the **Review Active Cards** item is marked complete when active cards exist.
3. In **Account Linking (Future)**, verify the text indicates tracking integrations are not yet available.
4. Record one manual usage note outside the app (example: `2026-03-05, Dining, used Amex Gold, expected 4x`) to validate the documented MVP tracking path.

Expected result:
- Upgrade Guide communicates current manual tracking approach clearly.
- No broken links or crashes while navigating Wallet -> Advisor -> Upgrade Guide.

## Pass Criteria
- All three sections above complete without console/runtime errors.
- Wallet persistence works after refresh.
- Advisor produces recommendation and displays Offers placeholder/disclaimer.
