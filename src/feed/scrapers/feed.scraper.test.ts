import type { CheerioAPI } from 'cheerio';
import axios from 'axios';

import { FeedScraper, FeedData } from './feed.scraper';

jest.mock('axios');

class TestScrapper extends FeedScraper {
  source = 'Test';
  homepageUrl = 'https://test.com';

  parseHome(_$: CheerioAPI): FeedData[] {
    return [
      {
        id: 'Id1',
        title: 'Test title',
        publicationDate: new Date(),
        source: this.source,
        author: 'Author',
        url: 'https://test.com/feed',
      },
    ];
  }
}

describe('FeedScraper', () => {
  it('fetchWebsiteData returns result of parseHome', async () => {
    const html = '<html></html>';
    (axios.get as jest.Mock).mockResolvedValue({ data: Buffer.from(html, 'utf-8') });

    const scraper = new TestScrapper();

    const feeds = await scraper.fetchWebsiteData();
    expect(Array.isArray(feeds)).toBe(true);
    expect(feeds.length).toBe(1);
    expect(feeds[0].id).toBe('Id1');
  });

  it('parseHome should return an array of feeds', () => {
    const scraper = new TestScrapper();
    const feeds = scraper.parseHome({} as CheerioAPI);

    expect(Array.isArray(feeds)).toBe(true);
    expect(feeds.length).toBe(1);
    expect(feeds[0].id).toBe('Id1');
  });
});
