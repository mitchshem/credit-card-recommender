# Credit Card Recommender App

A simple React + Node.js application that helps users find the best credit card from their wallet for specific merchant purchases.

## Features

- **Wallet View**: Display all credit cards in your wallet with reward rates and perks
- **Smart Recommendations**: Enter a merchant name to get the top 3 card recommendations
- **Category-based Matching**: Uses merchant categories (groceries, dining, travel, etc.) to match with card reward rates
- **Clean UI**: Minimal, responsive design with two main screens

## Project Structure

```
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── MerchantSearch.tsx # Main component with wallet and search
│   │   ├── types/
│   │   │   └── json.d.ts  # TypeScript declarations
│   │   ├── App.tsx        # Main app component
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
├── cards.json             # Credit card data with detailed information
└── merchants.json         # Merchant category mappings
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start the development server**:
   ```bash
   cd client
   npm start
   ```
   
   This will start the React frontend development server.

3. **Access the app**:
   - Frontend: http://localhost:3000

## How It Works

### Data Structure

**Credit Cards** (`cards.json`):
- Card details (name, network, annual fee)
- Reward rates by category (dining, groceries, travel, etc.)
- Key perks and benefits

**Merchants** (`merchants.json`):
- Maps merchant names to spending categories
- Used to determine which reward rate applies

### Recommendation Algorithm

1. User enters a merchant name
2. System looks up the merchant's category
3. Calculates reward rates for each card in the wallet
4. Sorts cards by reward rate (highest first)
5. Returns top 3 recommendations with explanations

### Example Usage

1. Go to "Get Recommendations" tab
2. Enter "Trader Joe's" → Gets grocery category → Recommends Amex Gold (4x points)
3. Enter "Uber" → Gets rideshare category → Recommends based on general travel rates
4. Enter "Delta" → Gets flights category → Recommends travel-focused cards

## Data Storage

- **Credit Cards**: Stored in `cards.json` with detailed information including network, annual fees, and perks
- **Merchant Mappings**: Stored in `merchants.json` for category classification
- **User Cards**: Custom cards are persisted in browser localStorage for session persistence

## Future Enhancements

- Add more merchants and categories
- Implement user authentication and cloud storage
- Add spending tracking and analytics
- Include annual fee calculations in recommendations
- Add more sophisticated recommendation algorithms
- Support for card benefits and perks comparison
- Mobile-responsive design improvements
