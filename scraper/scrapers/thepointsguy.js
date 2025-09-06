const { By, until } = require('selenium-webdriver');
const ScraperBase = require('../utils/scraper-base');
const config = require('../config');

class ThePointsGuyScraper extends ScraperBase {
  constructor() {
    super('ThePointsGuy');
  }

  async scrapeAllCategories() {
    const allCards = [];
    const endpoints = config.websites.thepointsguy.endpoints;

    try {
      await this.initDriver();

      for (const [category, endpoint] of Object.entries(endpoints)) {
        this.log(`Scraping ${category} category...`);
        const url = config.websites.thepointsguy.baseUrl + endpoint;
        
        const cards = await this.retryOperation(async () => {
          return await this.scrapeCategory(url, category);
        });

        allCards.push(...cards);
        await this.delay(config.scraping.delayBetweenRequests);
      }

      this.log(`Scraped ${allCards.length} cards from The Points Guy`);
      return allCards;

    } catch (error) {
      this.logError('Error scraping The Points Guy:', error);
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
      await this.driver.wait(until.elementsLocated(By.css('table tr, .card-row, .credit-card-row')), 10000);
      
      const cardRows = await this.driver.findElements(By.css('table tbody tr, .card-row, .credit-card-row'));
      
      this.log(`Found ${cardRows.length} card rows in ${category}`);

      for (let i = 0; i < Math.min(cardRows.length, 25); i++) {
        try {
          const cardData = await this.extractCardData(cardRows[i], category);
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

  async extractCardData(cardRow, category) {
    try {
      const cardName = await this.extractText(cardRow, 'td:first-child, .card-name, h3, h4');
      if (!cardName || cardName.length < 5) return null;

      const issuer = this.extractIssuerFromName(cardName);
      const annualFee = await this.extractText(cardRow, 'td:nth-child(3), .annual-fee');
      const rewardInfo = await this.extractRewardInfo(cardRow);
      const perks = await this.extractPerks(cardRow);
      const tpgRating = await this.extractText(cardRow, '.rating, .score, td:nth-child(2)');

      const cardData = {
        id: this.generateCardId(cardName, issuer),
        name: this.cleanText(cardName),
        network: this.determineNetwork(cardName),
        annual_fee: this.parseAnnualFee(annualFee),
        reward_rates: rewardInfo.rates,
        perks: perks,
        source: 'ThePointsGuy',
        category: category,
        signup_bonus: rewardInfo.signup_bonus,
        tpg_rating: tpgRating,
        redemption_value: rewardInfo.redemption_value
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

  async extractRewardInfo(cardRow) {
    const rewardInfo = {
      rates: { other: 1 },
      signup_bonus: '',
      redemption_value: ''
    };

    try {
      const cells = await cardRow.findElements(By.css('td'));
      
      for (const cell of cells) {
        const text = await cell.getText();
        
        if (text.includes('x') || text.includes('%')) {
          const rate = this.parseRewardRate(text);
          
          if (text.toLowerCase().includes('dining') || text.toLowerCase().includes('restaurant')) {
            rewardInfo.rates.dining = rate;
          } else if (text.toLowerCase().includes('grocery') || text.toLowerCase().includes('supermarket')) {
            rewardInfo.rates.groceries = rate;
          } else if (text.toLowerCase().includes('travel') || text.toLowerCase().includes('flight')) {
            rewardInfo.rates.travel = rate;
          } else if (text.toLowerCase().includes('gas') || text.toLowerCase().includes('fuel')) {
            rewardInfo.rates.gas = rate;
          }
        }

        if (text.toLowerCase().includes('bonus') || text.toLowerCase().includes('welcome')) {
          rewardInfo.signup_bonus = this.cleanText(text);
        }

        if (text.includes('¢') || text.includes('cent')) {
          rewardInfo.redemption_value = this.cleanText(text);
        }
      }

    } catch (error) {
      this.logError('Error extracting reward info:', error);
    }

    return rewardInfo;
  }

  async extractPerks(cardRow) {
    const perks = [];

    try {
      const cells = await cardRow.findElements(By.css('td'));
      
      for (const cell of cells) {
        const text = await cell.getText();
        
        if (text && text.length > 15 && text.length < 150) {
          if (text.toLowerCase().includes('credit') || 
              text.toLowerCase().includes('insurance') || 
              text.toLowerCase().includes('access') ||
              text.toLowerCase().includes('fee') ||
              text.toLowerCase().includes('benefit')) {
            perks.push(this.cleanText(text));
          }
        }
      }

    } catch (error) {
      this.logError('Error extracting perks:', error);
    }

    return perks.slice(0, 4);
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

module.exports = ThePointsGuyScraper;

if (require.main === module) {
  const scraper = new ThePointsGuyScraper();
  scraper.scrapeAllCategories()
    .then(cards => {
      console.log(`Scraped ${cards.length} cards from The Points Guy`);
      console.log(JSON.stringify(cards.slice(0, 3), null, 2));
    })
    .catch(console.error);
}
