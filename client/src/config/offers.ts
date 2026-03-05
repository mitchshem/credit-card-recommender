export type OfferCategory = 'dining' | 'travel' | 'groceries' | 'general';

export interface OfferConfig {
  id: string;
  title: string;
  description: string;
  category: OfferCategory;
  ctaLabel: string;
  ctaUrl: string;
  isActive: boolean;
}

export const OFFERS: OfferConfig[] = [
  {
    id: 'offer_dining_bonus_preview',
    title: 'Dining Bonus Preview',
    description: 'Placeholder for partner dining statement credit offers.',
    category: 'dining',
    ctaLabel: 'Notify Me',
    ctaUrl: '/offers/dining-bonus',
    isActive: false
  },
  {
    id: 'offer_travel_boost_preview',
    title: 'Travel Boost Preview',
    description: 'Placeholder for merchant travel cashback and points multipliers.',
    category: 'travel',
    ctaLabel: 'Notify Me',
    ctaUrl: '/offers/travel-boost',
    isActive: false
  }
];
