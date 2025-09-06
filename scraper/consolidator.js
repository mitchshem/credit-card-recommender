const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

class DataConsolidator {
  constructor() {
    this.allCards = [];
    this.duplicateCards = new Map();
  }

  async consolidateData(nerdwalletCards, tpgCards, bankrateCards) {
    console.log('Starting data consolidation...');
    
    const allSourceCards = [
      ...nerdwalletCards.map(card => ({ ...card, source: 'NerdWallet' })),
      ...tpgCards.map(card => ({ ...card, source: 'ThePointsGuy' })),
      ...bankrateCards.map(card => ({ ...card, source: 'Bankrate' }))
    ];

    console.log(`Total cards from all sources: ${allSourceCards.length}`);

    const consolidatedCards = this.deduplicateCards(allSourceCards);
    const finalCards = this.selectTopCards(consolidatedCards, 100);
    
    console.log(`Final consolidated cards: ${finalCards.length}`);
    
    return finalCards;
  }

  deduplicateCards(cards) {
    const cardMap = new Map();
    
    for (const card of cards) {
      const key = this.generateDeduplicationKey(card.name, card.network);
      
      if (cardMap.has(key)) {
        const existingCard = cardMap.get(key);
        const mergedCard = this.mergeCardData(existingCard, card);
        cardMap.set(key, mergedCard);
      } else {
        cardMap.set(key, { ...card });
      }
    }
    
    return Array.from(cardMap.values());
  }

  generateDeduplicationKey(name, network) {
    const cleanName = name.toLowerCase()
      .replace(/[®™©]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return `${cleanName}_${network.toLowerCase()}`;
  }

  mergeCardData(existing, newCard) {
    const merged = { ...existing };
    
    if (newCard.source === 'ThePointsGuy' && newCard.tpg_rating) {
      merged.tpg_rating = newCard.tpg_rating;
    }
    
    if (newCard.source === 'Bankrate' && newCard.bankrate_score) {
      merged.bankrate_score = newCard.bankrate_score;
    }
    
    if (newCard.annual_fee && newCard.annual_fee !== 0 && !existing.annual_fee) {
      merged.annual_fee = newCard.annual_fee;
    }
    
    merged.reward_rates = this.mergeRewardRates(existing.reward_rates, newCard.reward_rates);
    
    merged.perks = this.mergePerks(existing.perks, newCard.perks);
    
    if (newCard.signup_bonus && !existing.signup_bonus) {
      merged.signup_bonus = newCard.signup_bonus;
    }
    
    if (newCard.redemption_value && !existing.redemption_value) {
      merged.redemption_value = newCard.redemption_value;
    }
    
    merged.sources = merged.sources || [existing.source];
    if (!merged.sources.includes(newCard.source)) {
      merged.sources.push(newCard.source);
    }
    
    return merged;
  }

  mergeRewardRates(existing, newRates) {
    const merged = { ...existing };
    
    for (const [category, rate] of Object.entries(newRates)) {
      if (rate > (merged[category] || 0)) {
        merged[category] = rate;
      }
    }
    
    return merged;
  }

  mergePerks(existingPerks, newPerks) {
    const allPerks = [...(existingPerks || []), ...(newPerks || [])];
    const uniquePerks = [...new Set(allPerks.map(perk => perk.toLowerCase()))];
    
    return uniquePerks.slice(0, 6).map(perk => 
      allPerks.find(originalPerk => originalPerk.toLowerCase() === perk)
    );
  }

  selectTopCards(cards, limit) {
    const scoredCards = cards.map(card => ({
      ...card,
      score: this.calculateCardScore(card)
    }));
    
    scoredCards.sort((a, b) => b.score - a.score);
    
    return scoredCards.slice(0, limit).map(card => {
      const { score, sources, tpg_rating, bankrate_score, ...cleanCard } = card;
      return this.formatCardForOutput(cleanCard);
    });
  }

  calculateCardScore(card) {
    let score = 0;
    
    if (card.sources && card.sources.length > 1) {
      score += card.sources.length * 10;
    }
    
    const maxRewardRate = Math.max(...Object.values(card.reward_rates || { other: 1 }));
    score += maxRewardRate * 5;
    
    if (card.perks && card.perks.length > 0) {
      score += card.perks.length * 2;
    }
    
    if (card.signup_bonus) {
      score += 5;
    }
    
    if (card.annual_fee === 0) {
      score += 3;
    } else if (card.annual_fee < 100) {
      score += 1;
    }
    
    return score;
  }

  formatCardForOutput(card) {
    return {
      id: card.id,
      name: card.name,
      network: card.network,
      annual_fee: card.annual_fee || 0,
      reward_rates: card.reward_rates || { other: 1 },
      perks: (card.perks || []).slice(0, 5)
    };
  }

  async saveConsolidatedData(cards) {
    try {
      const outputPath = path.join(config.output.directory, config.output.filename);
      
      await fs.ensureDir(path.dirname(outputPath));
      
      const existingData = await this.loadExistingData(outputPath);
      if (existingData.length > 0) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(config.output.backupDirectory, `cards_backup_${timestamp}.json`);
        await fs.ensureDir(config.output.backupDirectory);
        await fs.writeJson(backupPath, existingData, { spaces: 2 });
        console.log(`Backup saved to: ${backupPath}`);
      }
      
      await fs.writeJson(outputPath, cards, { spaces: 2 });
      console.log(`Consolidated data saved to: ${outputPath}`);
      
      return outputPath;
    } catch (error) {
      console.error('Error saving consolidated data:', error);
      throw error;
    }
  }

  async loadExistingData(filePath) {
    try {
      if (await fs.pathExists(filePath)) {
        return await fs.readJson(filePath);
      }
    } catch (error) {
      console.warn('Could not load existing data:', error.message);
    }
    return [];
  }
}

module.exports = DataConsolidator;
