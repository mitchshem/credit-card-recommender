const { By, until } = require('selenium-webdriver');
const ScraperBase = require('../utils/scraper-base');
const config = require('../config');

class NerdWalletScraper extends ScraperBase {
  constructor() {
    super('NerdWallet');
  }

  async scrapeAllCategories() {
    const allCards = [];
    const endpoints = config.websites.nerdwallet.endpoints;

    try {
      await this.initDriver();

      for (const [category, endpoint] of Object.entries(endpoints)) {
        this.log(`Scraping ${category} category...`);
        const url = config.websites.nerdwallet.baseUrl + endpoint;
        
        const cards = await this.retryOperation(async () => {
          return await this.scrapeCategory(url, category);
        });

        allCards.push(...cards);
        await this.delay(config.scraping.delayBetweenRequests);
      }

      this.log(`Scraped ${allCards.length} cards from NerdWallet`);
      return allCards;

    } catch (error) {
      this.logError('Error scraping NerdWallet:', error);
      return [];
    } finally {
      await this.cleanup();
    }
  }

  async scrapeCategory(url, category) {
    const cards = [];

    if (!await this.navigateToPage(url)) {
      return cards;
    }

    try {
      await this.driver.wait(until.elementsLocated(By.css('tbody tr')), 10000);
      
      const cardElements = await this.driver.findElements(By.css('tbody tr'));
      
      this.log(`Found ${cardElements.length} card elements in ${category}`);

      for (let i = 0; i < Math.min(cardElements.length, 20); i++) {
        try {
          const cardData = await this.extractCardData(cardElements[i], category);
          if (cardData) {
            cards.push(cardData);
          }
        } catch (error) {
          this.logError(`Error extracting card ${i}:`, error);
        }
      }

    } catch (error) {
      this.logError(`Error finding card elements on ${url}:`, error);
    }

    return cards;
  }

  async extractCardData(cardElement, category) {
    try {
      const cardName = await this.extractText(cardElement, 'td:first-child');
      if (!cardName || cardName.length < 5) return null;

      const issuer = this.extractIssuerFromName(cardName);
      const annualFee = await this.extractText(cardElement, 'td:nth-child(3)'); // Annual fee column
      const rewardInfo = await this.extractRewardInfoFromRow(cardElement);
      const perks = await this.extractPerksFromRow(cardElement);

      const cardData = {
        id: this.generateCardId(cardName, issuer),
        name: this.cleanText(cardName),
        network: this.determineNetwork(cardName),
        annual_fee: this.parseAnnualFee(annualFee),
        reward_rates: rewardInfo.rates,
        perks: perks,
        source: 'NerdWallet',
        category: category,
        signup_bonus: rewardInfo.signup_bonus,
        foreign_transaction_fee: rewardInfo.foreign_fee
      };

      this.log(`Extracted: ${cardData.name}`);
      return cardData;

    } catch (error) {
      this.logError('Error extracting card data:', error);
      return null;
    }
  }

  async extractText(element, selector) {
    try {
      const subElement = await element.findElement(By.css(selector));
      return await subElement.getText();
    } catch (error) {
      return '';
    }
  }

  async extractRewardInfoFromRow(cardElement) {
    const rewardInfo = {
      rates: { other: 1 },
      signup_bonus: '',
      foreign_fee: 'Unknown'
    };

    try {
      const rewardsText = await this.extractText(cardElement, 'td:nth-child(4)');
      const rate = this.parseRewardRate(rewardsText);
      
      if (rate > 1) {
        rewardInfo.rates.other = rate;
      }
      
      const bonusText = await this.extractText(cardElement, 'td:nth-child(5)');
      if (bonusText) {
        rewardInfo.signup_bonus = this.cleanText(bonusText);
      }

    } catch (error) {
      this.logError('Error extracting reward info:', error);
    }

    return rewardInfo;
  }

  async extractPerksFromRow(cardElement) {
    const perks = [];

    try {
      const ratingText = await this.extractText(cardElement, 'td:nth-child(2)');
      
      if (ratingText && ratingText.includes('Best for')) {
        const bestForMatch = ratingText.match(/Best for (.+)/);
        if (bestForMatch) {
          perks.push(`Best for: ${bestForMatch[1]}`);
        }
      }

    } catch (error) {
      this.logError('Error extracting perks:', error);
    }

    return perks;
  }

  extractIssuerFromName(cardName) {
    const issuers = ['Chase', 'American Express', 'Capital One', 'Citi', 'Bank of America', 'Wells Fargo', 'Discover', 'Barclays'];
    
    for (const issuer of issuers) {
      if (cardName.toLowerCase().includes(issuer.toLowerCase())) {
        return issuer;
      }
    }

    return 'Unknown';
  }

  determineNetwork(cardName) {
    if (cardName.toLowerCase().includes('american express') || cardName.toLowerCase().includes('amex')) {
      return 'American Express';
    } else if (cardName.toLowerCase().includes('mastercard')) {
      return 'Mastercard';
    } else if (cardName.toLowerCase().includes('discover')) {
      return 'Discover';
    }
    
    return 'Visa';
  }
}

module.exports = NerdWalletScraper;

if (require.main === module) {
  const scraper = new NerdWalletScraper();
  scraper.scrapeAllCategories()
    .then(cards => {
      console.log(`Scraped ${cards.length} cards from NerdWallet`);
      console.log(JSON.stringify(cards.slice(0, 3), null, 2));
    })
    .catch(console.error);
}
