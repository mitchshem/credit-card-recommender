const NerdWalletScraper = require('./scrapers/nerdwallet');
const ThePointsGuyScraper = require('./scrapers/thepointsguy');
const BankrateScraper = require('./scrapers/bankrate');
const DataConsolidator = require('./consolidator');

class CreditCardScraper {
  constructor() {
    this.consolidator = new DataConsolidator();
  }

  async scrapeAllSites() {
    console.log('🚀 Starting credit card scraping process...');
    console.log('Target: Top 100 credit cards from NerdWallet, The Points Guy, and Bankrate');
    console.log('='.repeat(70));

    const results = {
      nerdwallet: [],
      thepointsguy: [],
      bankrate: []
    };

    try {
      console.log('\n📊 Scraping NerdWallet...');
      const nerdwalletScraper = new NerdWalletScraper();
      results.nerdwallet = await nerdwalletScraper.scrapeAllCategories();
      console.log(`✅ NerdWallet: ${results.nerdwallet.length} cards scraped`);

    } catch (error) {
      console.error('❌ NerdWallet scraping failed:', error.message);
    }

    try {
      console.log('\n🎯 Scraping The Points Guy...');
      const tpgScraper = new ThePointsGuyScraper();
      results.thepointsguy = await tpgScraper.scrapeAllCategories();
      console.log(`✅ The Points Guy: ${results.thepointsguy.length} cards scraped`);

    } catch (error) {
      console.error('❌ The Points Guy scraping failed:', error.message);
    }

    try {
      console.log('\n🏦 Scraping Bankrate...');
      const bankrateScraper = new BankrateScraper();
      results.bankrate = await bankrateScraper.scrapeAllCategories();
      console.log(`✅ Bankrate: ${results.bankrate.length} cards scraped`);

    } catch (error) {
      console.error('❌ Bankrate scraping failed:', error.message);
    }

    console.log('\n🔄 Consolidating and deduplicating data...');
    const consolidatedCards = await this.consolidator.consolidateData(
      results.nerdwallet,
      results.thepointsguy,
      results.bankrate
    );

    console.log('\n💾 Saving consolidated data...');
    const outputPath = await this.consolidator.saveConsolidatedData(consolidatedCards);

    console.log('\n🎉 Scraping completed successfully!');
    console.log('='.repeat(70));
    console.log(`📈 Total cards scraped: ${results.nerdwallet.length + results.thepointsguy.length + results.bankrate.length}`);
    console.log(`🎯 Final consolidated cards: ${consolidatedCards.length}`);
    console.log(`📁 Output file: ${outputPath}`);
    console.log('\n📋 Summary by source:');
    console.log(`   • NerdWallet: ${results.nerdwallet.length} cards`);
    console.log(`   • The Points Guy: ${results.thepointsguy.length} cards`);
    console.log(`   • Bankrate: ${results.bankrate.length} cards`);

    if (consolidatedCards.length > 0) {
      console.log('\n🔍 Sample cards:');
      consolidatedCards.slice(0, 3).forEach((card, index) => {
        console.log(`   ${index + 1}. ${card.name} (${card.network}) - $${card.annual_fee} annual fee`);
      });
    }

    return {
      success: true,
      totalScraped: results.nerdwallet.length + results.thepointsguy.length + results.bankrate.length,
      finalCount: consolidatedCards.length,
      outputPath,
      results
    };
  }
}

if (require.main === module) {
  const scraper = new CreditCardScraper();
  
  scraper.scrapeAllSites()
    .then(result => {
      if (result.success) {
        console.log('\n✨ All done! Your credit card database has been updated.');
        process.exit(0);
      } else {
        console.error('\n💥 Scraping failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

module.exports = CreditCardScraper;
