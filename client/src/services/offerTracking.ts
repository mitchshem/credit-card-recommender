import { OfferConfig } from '../config/offers';

const STORAGE_KEY = 'credit_card_advisor_offer_click_intents';

export interface OfferClickIntent {
  offerId: string;
  offerTitle: string;
  offerCategory: OfferConfig['category'];
  wasActive: boolean;
  targetUrl: string;
  timestamp: string;
}

function readIntents(): OfferClickIntent[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as OfferClickIntent[];
  } catch {
    return [];
  }
}

function writeIntents(intents: OfferClickIntent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(intents));
}

export function trackOfferClickIntent(offer: OfferConfig): OfferClickIntent {
  const intent: OfferClickIntent = {
    offerId: offer.id,
    offerTitle: offer.title,
    offerCategory: offer.category,
    wasActive: offer.isActive,
    targetUrl: offer.ctaUrl,
    timestamp: new Date().toISOString()
  };

  const intents = readIntents();
  intents.push(intent);
  writeIntents(intents);

  if (process.env.NODE_ENV === 'development') {
    // Keep this intentionally lightweight until analytics is integrated.
    // eslint-disable-next-line no-console
    console.log('[offer-tracking] click-intent', intent);
  }

  return intent;
}

export function getOfferClickIntents(): OfferClickIntent[] {
  return readIntents();
}
