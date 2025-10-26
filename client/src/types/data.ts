export interface Card {
  id: string;
  name: string;
  network: string;
  annual_fee: number;
  reward_rates: { [category: string]: number };
  perks: string[];
  source?: string;
  category?: string;
  signup_bonus?: string;
}

export interface DetailedCard extends Card {
  // Extended properties for wallet management
  isSelected?: boolean;
  isUserAdded?: boolean;
}

export interface Merchant {
  [merchant: string]: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  customMerchants: { [merchant: string]: string };
  customCards: any[];
  preferences: {
    defaultWalletCards: string[];
    favoriteMerchants: string[];
  };
}

export interface WalletCard extends DetailedCard {
  isSelected: boolean;
  isUserAdded: boolean;
}
