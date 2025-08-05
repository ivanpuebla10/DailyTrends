import logger from '../logger';

import Feed from './feed.model';
import { FeedScraper } from './scrapers/feed.scraper';
import { ElPaisScraper } from './scrapers/elpais.scraper';
import { ElMundoScraper } from './scrapers/elmundo.scraper';

export class FeedScraperService {
  private scrapers: FeedScraper[];

  constructor() {
    this.scrapers = [new ElPaisScraper(), new ElMundoScraper()];
  }
  async scrapeAndSaveAll(): Promise<void> {
    await Promise.all(
      this.scrapers.map(async (scraper) => {
        try {
          logger.info(`${scraper.source}: Starting scraping...`);
          const feeds = await scraper.fetchWebsiteData();
          for (const feed of feeds) {
            await Feed.findOneAndUpdate({ id: feed.id }, feed, {
              upsert: true,
              new: true,
            });
          }
          logger.info(`${scraper.source}: Scraping finished, ${feeds.length} feeds processed`);
        } catch (error) {
          logger.error(`${scraper.source}: Error during scraping:`, error);
        }
      }),
    );
  }
}
