const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

class ScraperBase {
  constructor(siteName) {
    this.siteName = siteName;
    this.driver = null;
    this.retryCount = 0;
  }

  async initDriver() {
    const options = new chrome.Options();
    
    if (config.scraping.headless) {
      options.addArguments('--headless');
    }
    
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    options.addArguments(`--user-agent=${config.scraping.userAgent}`);

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await this.driver.manage().setTimeouts({
      implicit: config.scraping.timeout,
      pageLoad: config.scraping.timeout,
      script: config.scraping.timeout
    });

    this.log('Driver initialized successfully');
  }

  async navigateToPage(url) {
    try {
      this.log(`Navigating to: ${url}`);
      await this.driver.get(url);
      await this.waitForPageLoad();
      this.log('Page loaded successfully');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to ${url}:`, error);
      return false;
    }
  }

  async waitForPageLoad() {
    await this.driver.wait(until.elementLocated(By.tagName('body')), config.scraping.timeout);
    await this.driver.executeScript('return document.readyState').then(state => {
      if (state !== 'complete') {
        return this.driver.wait(() => {
          return this.driver.executeScript('return document.readyState').then(state => state === 'complete');
        }, config.scraping.timeout);
      }
    });
  }

  async retryOperation(operation, maxRetries = config.scraping.retryAttempts) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        this.logError(`Attempt ${attempt} failed:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        await this.delay(config.scraping.delayBetweenRequests * attempt);
      }
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  cleanText(text) {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '');
  }

  parseAnnualFee(feeText) {
    if (!feeText) return 0;
    
    const cleanFee = feeText.toLowerCase().replace(/[^\d]/g, '');
    if (feeText.toLowerCase().includes('no annual fee') || feeText.includes('$0')) {
      return 0;
    }
    
    const fee = parseInt(cleanFee);
    return isNaN(fee) ? 0 : fee;
  }

  parseRewardRate(rateText) {
    if (!rateText) return 1;
    
    const match = rateText.match(/(\d+(?:\.\d+)?)[x%]/i);
    return match ? parseFloat(match[1]) : 1;
  }

  standardizeCategory(category) {
    if (!category) return 'other';
    
    const lowerCategory = category.toLowerCase();
    
    for (const [standardCategory, variations] of Object.entries(config.categoryMapping)) {
      if (variations.some(variation => lowerCategory.includes(variation))) {
        return standardCategory;
      }
    }
    
    return 'other';
  }

  standardizeNetwork(network) {
    if (!network) return 'Unknown';
    
    const lowerNetwork = network.toLowerCase();
    
    for (const [key, standardNetwork] of Object.entries(config.networkMapping)) {
      if (lowerNetwork.includes(key)) {
        return standardNetwork;
      }
    }
    
    return network;
  }

  generateCardId(cardName, issuer) {
    const cleanName = cardName.toLowerCase()
      .replace(/[®™©]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    const cleanIssuer = issuer.toLowerCase()
      .replace(/[^\w]/g, '')
      .substring(0, 10);
    
    return `${cleanIssuer}_${cleanName}`;
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.siteName}] ${message}`);
  }

  logError(message, error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${this.siteName}] ERROR: ${message}`, error?.message || error);
  }

  async cleanup() {
    if (this.driver) {
      try {
        await this.driver.quit();
        this.log('Driver closed successfully');
      } catch (error) {
        this.logError('Error closing driver:', error);
      }
    }
  }

  async saveBackup(data, filename) {
    try {
      await fs.ensureDir(config.output.backupDirectory);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(config.output.backupDirectory, `${filename}_${timestamp}.json`);
      await fs.writeJson(backupPath, data, { spaces: 2 });
      this.log(`Backup saved to: ${backupPath}`);
    } catch (error) {
      this.logError('Failed to save backup:', error);
    }
  }
}

module.exports = ScraperBase;
