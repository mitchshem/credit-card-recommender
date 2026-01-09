# Product Specification: Credit Card Advisor

**Version:** 1.0 (MVP)  
**Last Updated:** 2025-01-27  
**Status:** Draft

---

## Overview

Credit Card Advisor is a simple web application that helps users decide which credit card to use at a specific merchant to maximize rewards and benefits. Users connect their cards, search for a merchant, and get an instant recommendation with a clear explanation.

---

## User Personas

### 1. The Points Enthusiast (Primary)
- **Who:** Power user who actively manages 3-5 credit cards
- **Goals:** Maximize every transaction, understand reward structures, track category bonuses
- **Pain Points:** Hard to remember which card gives best rewards for each merchant
- **Tech Comfort:** High - comfortable with apps and managing accounts
- **Usage:** Daily - checks before making purchases

### 2. The Casual Optimizer (Secondary)
- **Who:** Has 2-3 cards, wants to optimize but not obsess
- **Goals:** Simple recommendations, minimal setup, quick answers
- **Pain Points:** Don't want to think too hard, just want the best card
- **Tech Comfort:** Medium - uses apps but prefers simplicity
- **Usage:** A few times per week, mainly for bigger purchases

### 3. The New Card Owner (Tertiary)
- **Who:** Just got their first or second rewards card
- **Goals:** Learn which card to use when, understand rewards categories
- **Pain Points:** Overwhelmed by card benefits, forgets which card has what
- **Tech Comfort:** Low to Medium
- **Usage:** Learning phase - frequent initially, then occasional

---

## Core User Flows

### Flow 1: First-Time Setup (New User)
1. User visits app
2. Signs in with Google (Firebase Auth)
3. **Onboarding prompt:** "Let's set up your wallet"
4. User adds cards to wallet:
   - Search/select from database of 50+ cards
   - Cards are pre-populated with benefits (no manual entry)
   - User can optionally nickname cards
5. User confirms wallet setup
6. **Success:** "Your wallet is ready! Try searching for a merchant."

**Goal:** Get user to their first recommendation in < 2 minutes

---

### Flow 2: Get a Recommendation (Primary Flow)
1. User is signed in and has wallet set up
2. User searches for merchant (e.g., "Trader Joe's", "Uber", "Delta Airlines")
   - Search by merchant name
   - Or browse by category
3. App matches merchant to category (e.g., "grocery", "rideshare", "airline")
4. **App calculates:**
   - Which cards in wallet have best rewards for this category
   - Reward rates, multipliers, caps, restrictions
   - Ranking based on value
5. **App displays recommendation:**
   - Primary: "Use [Card Name] - 4% cash back"
   - Secondary: "Or [Other Card] - 3 points per dollar"
   - **Explanation:** Clear, simple reason (e.g., "This card gives 4% back on groceries, your highest rate")
6. User can tap to see full card details or change merchant

**Goal:** Answer ready in < 3 seconds, explanation is clear to casual user

---

### Flow 3: Manage Wallet
1. User navigates to Wallet page
2. Sees all cards they've added
3. Can:
   - Add new cards (search from database)
   - Remove cards
   - Toggle cards active/inactive (for cards they're not currently using)
   - See quick stats (e.g., "You have 5 cards, 3 active")
4. Changes save automatically

**Goal:** Easy to keep wallet up-to-date

---

## Feature List

### MVP (Must Have - Launch Version)

#### Authentication & User Management
- [x] Sign in with Google (Firebase Auth)
- [ ] User profile with basic preferences
- [ ] Sign out functionality

#### Wallet Management
- [x] Add cards from pre-populated database (50+ cards)
- [x] View all cards in wallet
- [ ] Remove cards from wallet
- [ ] Mark cards as active/inactive
- [x] Card data auto-populated (no manual entry)

#### Merchant Search & Matching
- [x] Search merchants by name
- [x] Merchant-to-category mapping
- [ ] Popular merchants quick-select
- [x] Category-based matching

#### Recommendations Engine
- [x] Calculate best card for merchant/category
- [x] Rank cards by reward value
- [x] Show clear explanation ("Use X because...")
- [ ] Handle edge cases (tied rewards, caps, restrictions)

#### Core UI/UX
- [x] Clean, simple interface
- [x] Mobile-responsive design
- [ ] Loading states
- [ ] Error handling with friendly messages

---

### Phase 2 (Nice to Have - Post-Launch)

#### Enhanced Recommendations
- [ ] Consider spending caps (e.g., "5% on first $1,500")
- [ ] Factor in annual fees when comparing
- [ ] Show potential savings ("You'd earn $X more per year")
- [ ] Consider signup bonuses and spending requirements

#### Personalization
- [ ] Remember frequently searched merchants
- [ ] Show spending insights ("You spend most on groceries")
- [ ] Suggest card optimizations ("You're missing out on...")

#### Advanced Features
- [ ] Add custom merchants (not in database)
- [ ] Set spending amounts to see reward calculations
- [ ] Compare cards side-by-side
- [ ] Track historical recommendations

#### User Preferences
- [ ] Preferred reward type (points vs. cash back)
- [ ] Favorite merchants list
- [ ] Notification preferences

---

## Non-Functional Goals

### 1. Simplicity
- **Principle:** Everything should be understandable in < 10 seconds
- **Examples:**
  - Recommendation explanation: "Use Amex Gold - 4x points on groceries" (not "4x MR points with up to $25k annual cap")
  - Wallet setup: Max 3 clicks to add a card
  - No jargon: "Rewards" not "earn rate multiplier"

### 2. Security & Privacy
- **Never store:**
  - Full credit card numbers
  - CVV codes
  - Expiration dates
  - Billing addresses
  - Payment information
- **Only store:**
  - Card IDs (references to database)
  - User preferences
  - Merchant mappings
  - Reward preferences
- **Compliance:** No PCI requirements (we don't handle payments)

### 3. Explainability
- **Every recommendation must include:**
  - Clear winner ("Use Card X")
  - Simple reason ("4% back on groceries")
  - Alternative if close ("Or Card Y for 3%")
- **Avoid:**
  - Complex calculations in explanation
  - Industry jargon
  - Multiple if/then scenarios

### 4. Performance
- **Target metrics:**
  - Recommendation calculation: < 500ms
  - Page load: < 2 seconds
  - Merchant search: Instant (as user types)

### 5. Reliability
- **Offline capability:** Not required for MVP
- **Error handling:** Friendly messages, no technical errors shown
- **Data freshness:** Card database updated monthly (manual for MVP)

---

## Technical Constraints

### MVP Scope
- **Single-page application (SPA)** - React with state-based navigation
- **No backend API** - All logic in frontend, Firebase for auth/data
- **Static card database** - JSON file, updated manually
- **Static merchant database** - JSON file, updated manually

### Data Storage
- **Firebase Firestore:**
  - User profiles
  - User wallets (array of card IDs)
  - User preferences
- **Static JSON files (client-side):**
  - Card database (50+ cards with full details)
  - Merchant-to-category mapping

### Future Considerations
- Card database could move to Firestore for easier updates
- Merchant database could be user-contributed
- Recommendation algorithm could be server-side for better performance

---

## Success Metrics (Post-Launch)

### Engagement
- **Daily Active Users (DAU):** Target 20% of registered users
- **Recommendations per user per week:** Target 5+
- **Wallet size:** Average 3-4 cards per user

### User Satisfaction
- **Time to first recommendation:** < 2 minutes for new users
- **Return usage:** 40% of users return within 7 days
- **Support requests:** < 5% of users need help

### Quality
- **Recommendation accuracy:** 95%+ (manual spot checks)
- **Error rate:** < 1% of recommendations fail
- **Data freshness:** Card database updated monthly

---

## Out of Scope (Not in MVP)

- **Payment processing** - We don't handle transactions
- **Transaction history** - We don't connect to banks/credit card accounts
- **Spending analytics** - No tracking of actual purchases
- **Multi-user accounts** - One wallet per user account
- **Card applications** - No links to apply for new cards (future)
- **Real-time card updates** - Database updates are manual
- **Mobile apps** - Web app only for MVP

---

## MVP Summary

**The MVP is a simple, fast tool that:**
1. Lets users sign in with Google
2. Builds a wallet of their cards (from pre-populated database)
3. Searches for merchants and gets instant recommendations
4. Shows clear, simple explanations for why each card is recommended
5. Works on mobile and desktop

**Everything else can wait.**

---

## Future Vision (Beyond MVP)

- **Smart notifications:** "Remember to use X card at Y merchant"
- **Spending insights:** "You could earn $X more per year by..."
- **Card recommendations:** "Based on your spending, consider..."
- **Community features:** User-contributed merchant mappings
- **API access:** For power users and integrations

But for MVP: **Keep it simple, keep it fast, solve one problem really well.**

