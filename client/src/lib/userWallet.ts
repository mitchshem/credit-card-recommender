import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Card } from '../types/data';

export interface UserWalletCard {
  cardId: string;
  customRewardRates?: { [category: string]: number };
  isSelected: boolean;
  addedAt: any;
  lastModified?: any;
  customName?: string;
}

export interface UserWallet {
  cards: UserWalletCard[];
  lastSync: any;
  version: number;
}

const WALLET_VERSION = 1;

/**
 * Get user's wallet from Firestore
 */
export async function getUserWallet(userId: string): Promise<UserWallet | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    return userData.wallet || {
      cards: [],
      lastSync: null,
      version: WALLET_VERSION
    };
  } catch (error) {
    console.error('Error getting user wallet:', error);
    return null;
  }
}

/**
 * Save user's wallet to Firestore
 */
export async function saveUserWallet(userId: string, wallet: UserWallet): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      wallet: {
        ...wallet,
        lastSync: serverTimestamp(),
        version: WALLET_VERSION
      }
    });
  } catch (error) {
    console.error('Error saving user wallet:', error);
    throw error;
  }
}

/**
 * Add card to user's wallet in Firestore
 */
export async function addCardToUserWallet(
  userId: string,
  cardId: string,
  customRewardRates?: { [category: string]: number },
  isSelected: boolean = true
): Promise<void> {
  const wallet = await getUserWallet(userId) || {
    cards: [],
    lastSync: null,
    version: WALLET_VERSION
  };

  // Check if card already exists
  const existingIndex = wallet.cards.findIndex(card => card.cardId === cardId);
  
  if (existingIndex >= 0) {
    // Update existing card
    wallet.cards[existingIndex] = {
      ...wallet.cards[existingIndex],
      customRewardRates,
      isSelected,
      lastModified: serverTimestamp()
    };
  } else {
    // Add new card
    wallet.cards.push({
      cardId,
      customRewardRates,
      isSelected,
      addedAt: serverTimestamp(),
      lastModified: serverTimestamp()
    });
  }

  await saveUserWallet(userId, wallet);
}

/**
 * Remove card from user's wallet
 */
export async function removeCardFromUserWallet(userId: string, cardId: string): Promise<void> {
  const wallet = await getUserWallet(userId);
  
  if (!wallet) {
    return;
  }

  wallet.cards = wallet.cards.filter(card => card.cardId !== cardId);
  await saveUserWallet(userId, wallet);
}

/**
 * Toggle card selection status
 */
export async function toggleUserCardSelection(userId: string, cardId: string): Promise<void> {
  const wallet = await getUserWallet(userId);
  
  if (!wallet) {
    return;
  }

  const cardIndex = wallet.cards.findIndex(card => card.cardId === cardId);
  
  if (cardIndex >= 0) {
    wallet.cards[cardIndex].isSelected = !wallet.cards[cardIndex].isSelected;
    wallet.cards[cardIndex].lastModified = serverTimestamp();
    await saveUserWallet(userId, wallet);
  }
}

/**
 * Toggle all cards selection
 */
export async function toggleAllUserCardsSelection(userId: string, selected: boolean): Promise<void> {
  const wallet = await getUserWallet(userId);
  
  if (!wallet) {
    return;
  }

  wallet.cards = wallet.cards.map(card => ({
    ...card,
    isSelected: selected,
    lastModified: serverTimestamp()
  }));

  await saveUserWallet(userId, wallet);
}

/**
 * Update card's custom reward rates
 */
export async function updateCardRewardRates(
  userId: string,
  cardId: string,
  customRewardRates: { [category: string]: number }
): Promise<void> {
  const wallet = await getUserWallet(userId);
  
  if (!wallet) {
    return;
  }

  const cardIndex = wallet.cards.findIndex(card => card.cardId === cardId);
  
  if (cardIndex >= 0) {
    wallet.cards[cardIndex].customRewardRates = customRewardRates;
    wallet.cards[cardIndex].lastModified = serverTimestamp();
    await saveUserWallet(userId, wallet);
  }
}

/**
 * Merge Firestore wallet with local cards data
 */
export function mergeUserWalletWithCards(wallet: UserWallet, allCards: Card[]) {
  return wallet.cards
    .map(walletCard => {
      const cardData = allCards.find(c => c.id === walletCard.cardId);
      
      if (!cardData) {
        return null;
      }

      return {
        ...cardData,
        reward_rates: walletCard.customRewardRates || cardData.reward_rates,
        isSelected: walletCard.isSelected,
        isUserAdded: false // Cards from Firestore are considered system cards
      };
    })
    .filter((card): card is NonNullable<typeof card> => card !== null);
}

/**
 * Get selected cards from user wallet
 */
export function getSelectedUserWalletCards(wallet: UserWallet, allCards: Card[]) {
  return mergeUserWalletWithCards(wallet, allCards).filter(card => card.isSelected);
}
