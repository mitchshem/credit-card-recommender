export interface SignupBonus {
  points?: number;
  miles?: number;
  spend_required: number;
  months: number;
  value: number;
}

export interface Benefits {
  travel_insurance?: boolean;
  rental_car_insurance?: boolean;
  trip_cancellation?: boolean;
  baggage_delay?: boolean;
  purchase_protection?: boolean;
  extended_warranty?: boolean;
  return_protection?: boolean;
  concierge_service?: boolean;
  airport_lounge_access?: boolean;
}

export interface Fees {
  foreign_transaction?: number;
  cash_advance?: number;
  late_payment?: number;
  over_limit?: number;
}

export interface Redemption {
  options: string[];
  best_value?: string;
  transfer_partners?: string[];
}

export interface Card {
  id: string;
  name: string;
  network: string;
  issuer?: string;
  annual_fee: number;
  reward_rates: { [category: string]: number };
  perks: string[];
  signup_bonus?: SignupBonus;
  benefits?: Benefits;
  fees?: Fees;
  redemption?: Redemption;
  categories?: string[];
  credit_score_required?: string;
  recommended_for?: string[];
  source?: string;
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
