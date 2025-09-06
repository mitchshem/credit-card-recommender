# Credit Card Scraper

A comprehensive, modular scraper system that extracts credit card data from NerdWallet, The Points Guy, and Bankrate to build a database of the top 100 most popular credit cards.

## Features

- **Multi-source scraping**: NerdWallet, The Points Guy, and Bankrate
- **Intelligent deduplication**: Merges data from multiple sources for the same card
- **Respectful scraping**: Built-in delays and retry logic
- **Error handling**: Robust error handling and logging
- **Modular architecture**: Easy to extend with new sources
- **Data consolidation**: Prioritizes data sources and standardizes formats
- **Backup system**: Automatically backs up existing data before updates

## Installation

1. Install dependencies:
```bash
cd scraper
npm install
```

2. Install Chrome/Chromium for Selenium:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y chromium-browser

# Or install Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

## Usage

### Full Scraping (All Sources)
```bash
npm run scrape
```

### Individual Source Scraping
```bash
# NerdWallet only
npm run scrape-nerdwallet

# The Points Guy only
npm run scrape-tpg

# Bankrate only
npm run scrape-bankrate
```

### Refresh Existing Database
```bash
npm run refresh

# With options
node refresh-cards.js --nerdwallet-only
node refresh-cards.js --max-50
```

## Configuration

Edit `config.js` to customize:

- **Website URLs and endpoints**
- **Scraping timeouts and delays**
- **Category mappings**
- **Output paths**
- **Retry settings**

## Data Format

The scraper outputs data in the format expected by the credit card recommender app:

```json
[
  {
    "id": "chase_sapphire_preferred",
    "name": "Chase Sapphire Preferred® Card",
    "network": "Visa",
    "annual_fee": 95,
    "reward_rates": {
      "travel": 2,
      "dining": 2,
      "other": 1
    },
    "perks": [
      "Primary rental car insurance",
      "25% more value redeeming through Chase Travel"
    ]
  }
]
```

## Architecture

```
scraper/
├── config.js              # Configuration settings
├── index.js               # Main orchestrator
├── consolidator.js        # Data merging and deduplication
├── refresh-cards.js       # Refresh utility
├── utils/
│   └── scraper-base.js    # Base scraper class
└── scrapers/
    ├── nerdwallet.js      # NerdWallet scraper
    ├── thepointsguy.js    # The Points Guy scraper
    └── bankrate.js        # Bankrate scraper
```

## How It Works

1. **Individual Scrapers**: Each website has a dedicated scraper that understands its specific DOM structure
2. **Data Extraction**: Extracts card name, issuer, annual fee, reward rates, perks, and other attributes
3. **Standardization**: Maps different category names to standardized format
4. **Consolidation**: Merges data from multiple sources, handling duplicates intelligently
5. **Scoring**: Ranks cards based on multiple factors (reward rates, perks, source coverage)
6. **Output**: Generates top 100 cards in the required JSON format

## Data Sources Priority

When the same card appears on multiple sites:
- **Annual fees**: Uses most reliable/recent data
- **Reward rates**: Takes the highest rate for each category
- **Perks**: Merges unique perks from all sources
- **Ratings**: Preserves TPG ratings and Bankrate scores

## Error Handling

- **Retry logic**: Automatically retries failed requests
- **Graceful degradation**: Continues if one source fails
- **Detailed logging**: Comprehensive logs for debugging
- **Backup system**: Preserves existing data before updates

## Maintenance

### Regular Updates
Run the scraper monthly to keep data current:
```bash
npm run refresh
```

### Adding New Sources
1. Create new scraper in `scrapers/` directory
2. Extend `ScraperBase` class
3. Add configuration to `config.js`
4. Update main orchestrator in `index.js`

### Troubleshooting

**Common Issues:**
- **Chrome not found**: Install Chrome/Chromium
- **Timeout errors**: Increase timeout in config
- **Rate limiting**: Increase delay between requests
- **DOM changes**: Update selectors in individual scrapers

**Debug Mode:**
Set `headless: false` in config.js to see browser actions.

## Output

- **Main output**: `../client/src/cards.json`
- **Backups**: `./backups/cards_backup_[timestamp].json`
- **Reports**: `./reports/refresh_[timestamp].json`

## Performance

- **Typical runtime**: 5-10 minutes for full scrape
- **Memory usage**: ~200MB peak
- **Network requests**: ~100-200 total
- **Respectful delays**: 2 seconds between requests

## Legal Compliance

This scraper:
- Respects robots.txt guidelines
- Uses reasonable delays between requests
- Only scrapes publicly available data
- Does not overwhelm target servers
- Follows fair use principles

## Support

For issues or questions:
1. Check the logs for error details
2. Verify Chrome/Chromium installation
3. Test individual scrapers first
4. Check website structure changes
