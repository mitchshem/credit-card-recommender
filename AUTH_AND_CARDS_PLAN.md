# Authentication and Card Data System Plan

## Phase 1: Authentication System

### Tech Stack
- Backend: Node.js + Express + Firebase Auth (Google, Apple OAuth)
- Frontend: React + Firebase Auth SDK
- Database: Firebase Firestore for user profiles

### Features
1. Google Sign-In (Firebase Auth)
2. Apple Sign-In (Firebase Auth)
3. Email/Password Authentication
4. User Profile Management

## Phase 2: Card Data Enrichment

### Current State
- 4 cards manually entered
- Basic reward rates
- Limited perks data

### Improvements Needed
1. Scraper Enhancement
   - Automate NerdWallet scraping
   - Parse structured card data
   - Extract: rewards, perks, fees, bonuses

2. Data Structure
   - JSON database with 50+ cards
   - Categorized by networks
   - Searchable metadata

3. Auto-Population
   - Users select card name
   - System auto-fills all data
   - No manual input required

## Phase 3: UI Improvements

1. Card Selection
   - Modern dropdown with search
   - Auto-complete
   - Card previews

2. User Dashboard
   - Personalized recommendations
   - Spending analytics
   - Wallet management

## Implementation Priority
1. Set up Firebase Auth
2. Improve scraper
3. Enhance UI components
4. Add user profiles
5. Connect everything

