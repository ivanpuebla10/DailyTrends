import * as crypto from 'crypto';

import { CheerioAPI } from 'cheerio';

import { FeedScraper, FeedData } from './feed.scraper';

export class ElPaisScraper extends FeedScraper {
  source = 'El País';
  homepageUrl = 'https://elpais.com/';

  private extractDataFromUrl(url: string): { id: string; publicationDate: Date } {
    const urlCleaned = url.split('?')[0];
    const lastSegment = urlCleaned.substring(urlCleaned.lastIndexOf('/') + 1);
    const feedId = lastSegment.replace('.html', '');
    const id = feedId
      ? crypto.createHash('sha256').update(feedId).digest('hex').substring(0, 24)
      : crypto.randomUUID();
    const date = url.match(/(\d{4}-\d{2}-\d{2})/);
    const publicationDate = date ? new Date(date[1]) : new Date();

    return { id, publicationDate };
  }

  protected parseHome($: CheerioAPI): FeedData[] {
    const items: FeedData[] = [];

    $('article').each((_, article) => {
      const el = $(article);
      const title = el.find('h2.c_t a').text().trim();
      const url = el.find('h2.c_t a').attr('href') ?? '';
      const summary = el.find('p.c_d').text().trim();
      const author = el.find('div.c_a a').text().trim();
      const imgEl = el.find('figure img');
      const imageUrl = imgEl.attr('src') ?? '';
      if (title && url) {
        const { id, publicationDate } = this.extractDataFromUrl(url);
        items.push({
          id,
          title,
          summary,
          author,
          publicationDate: publicationDate || new Date(),
          source: this.source,
          url,
          imageUrl,
        });
      }
    });

    return items;
  }
}
