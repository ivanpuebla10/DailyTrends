import axios from 'axios';
import iconv from 'iconv-lite';
import { CheerioAPI, load } from 'cheerio';

import { FeedScraper, FeedData } from './feed.scraper';

export class ElMundoScraper extends FeedScraper {
  source = 'El Mundo';
  homepageUrl = 'https://www.elmundo.es/';

  async fetchWebsiteData(): Promise<FeedData[]> {
    const response = await axios.get(this.homepageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    const html = iconv.decode(Buffer.from(response?.data), 'iso-8859-15');
    const $ = load(html);

    return this.parseHome($);
  }

  private extractDateFromUrl(url: string): Date {
    const date = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);

    return date ? new Date(`${date[1]}-${date[2]}-${date[3]}`) : new Date();
  }

  protected parseHome($: CheerioAPI): FeedData[] {
    const items: FeedData[] = [];

    $('article[ue-article-id]').each((_, el) => {
      const id = $(el).attr('ue-article-id') ?? '';
      const title = $(el).find('header > a > h2').text().trim();
      const url = $(el).find('header > a').attr('href') ?? '';
      const author = $(el).find('.ue-c-cover-content__byline-name a').text().trim() || '';
      const imageUrl = $(el).find('figure img').attr('src') ?? '';

      if (title && url) {
        const publicationDate = this.extractDateFromUrl(url);
        items.push({
          id: id || url,
          title,
          author,
          publicationDate,
          source: this.source,
          url,
          imageUrl,
        });
      }
    });

    return items;
  }
}
