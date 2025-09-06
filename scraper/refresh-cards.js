const CreditCardScraper = require('./index');
const fs = require('fs-extra');
const path = require('path');

class CardRefresher {
  constructor() {
    this.scraper = new CreditCardScraper();
  }

  async refreshCards(options = {}) {
    const {
      sources = ['nerdwallet', 'thepointsguy', 'bankrate'],
      categories = null,
      maxCards = 100
    } = options;

    console.log('🔄 Starting card database refresh...');
    console.log(`Sources: ${sources.join(', ')}`);
    console.log(`Max cards: ${maxCards}`);
    
    if (categories) {
      console.log(`Categories: ${categories.join(', ')}`);
    }

    try {
      const result = await this.scraper.scrapeAllSites();
      
      if (result.success) {
        console.log('\n✅ Card database refreshed successfully!');
        console.log(`📊 Updated with ${result.finalCount} cards`);
        
        await this.generateRefreshReport(result);
        
        return result;
      } else {
        throw new Error('Scraping failed');
      }
      
    } catch (error) {
      console.error('❌ Refresh failed:', error);
      throw error;
    }
  }

  async generateRefreshReport(result) {
    const report = {
      timestamp: new Date().toISOString(),
      totalScraped: result.totalScraped,
      finalCount: result.finalCount,
      sources: {
        nerdwallet: result.results.nerdwallet.length,
        thepointsguy: result.results.thepointsguy.length,
        bankrate: result.results.bankrate.length
      },
      outputPath: result.outputPath
    };

    const reportPath = path.join(__dirname, 'reports', `refresh_${Date.now()}.json`);
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(`📋 Refresh report saved to: ${reportPath}`);
  }
}

if (require.main === module) {
  const refresher = new CardRefresher();
  
  const args = process.argv.slice(2);
  const options = {};
  
  if (args.includes('--nerdwallet-only')) {
    options.sources = ['nerdwallet'];
  } else if (args.includes('--tpg-only')) {
    options.sources = ['thepointsguy'];
  } else if (args.includes('--bankrate-only')) {
    options.sources = ['bankrate'];
  }
  
  if (args.includes('--max-50')) {
    options.maxCards = 50;
  }

  refresher.refreshCards(options)
    .then(() => {
      console.log('\n🎉 Refresh completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Refresh failed:', error);
      process.exit(1);
    });
}

module.exports = CardRefresher;
