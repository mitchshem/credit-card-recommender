module.exports = {
  websites: {
    nerdwallet: {
      baseUrl: 'https://www.nerdwallet.com',
      endpoints: {
        travel: '/best/credit-cards/travel',
        cashback: '/best/credit-cards/cash-back',
        rewards: '/best/credit-cards/rewards',
        business: '/best/credit-cards/small-business',
        airline: '/best/credit-cards/airline',
        hotel: '/best/credit-cards/hotel'
      }
    },
    thepointsguy: {
      baseUrl: 'https://www.thepointsguy.com',
      endpoints: {
        best: '/credit-cards/best/',
        travel: '/credit-cards/best-travel-credit-cards/',
        cashback: '/credit-cards/best-cash-back-credit-cards/',
        airline: '/credit-cards/best-airline-credit-cards/',
        hotel: '/credit-cards/best-hotel-credit-cards/'
      }
    },
    bankrate: {
      baseUrl: 'https://www.bankrate.com',
      endpoints: {
        best: '/credit-cards/best-credit-cards/',
        travel: '/credit-cards/best-travel-credit-cards/',
        cashback: '/credit-cards/best-cash-back-credit-cards/',
        rewards: '/credit-cards/best-rewards-credit-cards/',
        business: '/credit-cards/best-business-credit-cards/'
      }
    }
  },

  scraping: {
    headless: true,
    timeout: 30000,
    retryAttempts: 3,
    delayBetweenRequests: 2000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },

  output: {
    directory: '../client/src',
    filename: 'cards.json',
    backupDirectory: './backups'
  },

  categoryMapping: {
    'dining': ['dining', 'restaurants', 'food', 'restaurant'],
    'groceries': ['groceries', 'supermarkets', 'grocery stores', 'grocery'],
    'travel': ['travel', 'flights', 'airfare', 'airlines', 'airline'],
    'gas': ['gas', 'gasoline', 'fuel', 'gas stations'],
    'hotels': ['hotels', 'lodging', 'accommodation', 'hotel'],
    'other': ['other', 'all purchases', 'everything else', 'all other purchases']
  },

  networkMapping: {
    'visa': 'Visa',
    'mastercard': 'Mastercard',
    'american express': 'American Express',
    'amex': 'American Express',
    'discover': 'Discover'
  }
};
