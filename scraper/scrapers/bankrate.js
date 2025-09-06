const { By, until } = require('selenium-webdriver');
const ScraperBase = require('../utils/scraper-base');
const config = require('../config');

class BankrateScraper extends ScraperBase {
  constructor() {
    super('Bankrate');
  }

  async scrapeAllCategories() {
    const allCards = [];
    const endpoints = config.websites.bankrate.endpoints;

    try {
      await this.initDriver();

      for (const [category, endpoint] of Object.entries(endpoints)) {
        this.log(`Scraping ${category} category...`);
        const url = config.websites.bankrate.baseUrl + endpoint;
        
        const cards = await this.retryOperation(async () => {
          return await this.scrapeCategory(url, category);
        });

        allCards.push(...cards);
        await this.delay(config.scraping.delayBetweenRequests);
      }

      this.log(`Scraped ${allCards.length} cards from Bankrate`);
      return allCards;

    } catch (error) {
      this.logError('Error scraping Bankrate:', error);
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
      await this.driver.wait(until.elementsLocated(By.css('h2, section, article')), 10000);
      
      const cardElements = await this.driver.findElements(By.css('h2'));
      
      this.log(`Found ${cardElements.length} card elements in ${category}`);

      for (let i = 0; i < Math.min(cardElements.length, 15); i++) {
        try {
          const text = await cardElements[i].getText();
          if (text && (text.includes('®') || text.toLowerCase().includes('card')) && text.length > 5) {
            const cardData = await this.extractCardData(cardElements[i], category);
            if (cardData) {
              cards.push(cardData);
            }
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
      const cardName = await cardElement.getText();
      if (!cardName || cardName.length < 5) return null;

      const issuer = this.extractIssuerFromName(cardName);
      
      const cardContainer = await cardElement.findElement(By.xpath('./ancestor::*[contains(@class, "card") or contains(@class, "section") or self::section or self::article][1]'));
      
      const annualFee = await this.extractTextFromContainer(cardContainer, 'annual fee');
      const rewardInfo = await this.extractRewardInfoFromContainer(cardContainer);
      const perks = await this.extractPerksFromContainer(cardContainer);
      const bankrateScore = await this.extractTextFromContainer(cardContainer, 'rating');

      const cardData = {
        id: this.generateCardId(cardName, issuer),
        name: this.cleanText(cardName),
        network: this.determineNetwork(cardName),
        annual_fee: this.parseAnnualFee(annualFee),
        reward_rates: rewardInfo.rates,
        perks: perks,
        source: 'Bankrate',
        category: category,
        signup_bonus: rewardInfo.signup_bonus,
        bankrate_score: bankrateScore,
        intro_apr: rewardInfo.intro_apr
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

  async extractTextFromContainer(container, keyword) {
    try {
      const allText = await container.getText();
      const lines = allText.split('\n');
      
      for (const line of lines) {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          return line.trim();
        }
      }
      
      return '';
    } catch (error) {
      return '';
    }
  }

  async extractRewardInfoFromContainer(container) {
    const rewardInfo = {
      rates: { other: 1 },
      signup_bonus: '',
      intro_apr: ''
    };

    try {
      const allText = await container.getText();
      const lines = allText.split('\n');
      
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        
        if (lowerLine.includes('%') || lowerLine.includes('x ') || lowerLine.includes('points')) {
          const rate = this.parseRewardRate(line);
          
          if (lowerLine.includes('dining') || lowerLine.includes('restaurant')) {
            rewardInfo.rates.dining = rate;
          } else if (lowerLine.includes('grocery') || lowerLine.includes('supermarket')) {
            rewardInfo.rates.groceries = rate;
          } else if (lowerLine.includes('travel') || lowerLine.includes('flight')) {
            rewardInfo.rates.travel = rate;
          } else if (lowerLine.includes('gas') || lowerLine.includes('fuel')) {
            rewardInfo.rates.gas = rate;
          } else if (lowerLine.includes('cash back') && rate > 1) {
            rewardInfo.rates.other = rate;
          }
        }
        
        if (lowerLine.includes('bonus') || lowerLine.includes('earn') || lowerLine.includes('points after')) {
          rewardInfo.signup_bonus = line.trim();
        }

        if (lowerLine.includes('intro apr') || lowerLine.includes('0% apr')) {
          rewardInfo.intro_apr = line.trim();
        }
      }

    } catch (error) {
      this.logError('Error extracting reward info:', error);
    }

    return rewardInfo;
  }

  async extractPerksFromContainer(container) {
    const perks = [];

    try {
      const allText = await container.getText();
      const lines = allText.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        const lowerLine = trimmedLine.toLowerCase();
        
        if (trimmedLine.length > 15 && trimmedLine.length < 150) {
          if (lowerLine.includes('credit') || lowerLine.includes('access') || 
              lowerLine.includes('protection') || lowerLine.includes('insurance') ||
              lowerLine.includes('lounge') || lowerLine.includes('tsa') ||
              lowerLine.includes('priority') || lowerLine.includes('waived') ||
              lowerLine.includes('no foreign transaction')) {
            perks.push(this.cleanText(trimmedLine));
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

module.exports = BankrateScraper;

if (require.main === module) {
  const scraper = new BankrateScraper();
  scraper.scrapeAllCategories()
    .then(cards => {
      console.log(`Scraped ${cards.length} cards from Bankrate`);
      console.log(JSON.stringify(cards.slice(0, 3), null, 2));
    })
    .catch(console.error);
}
