import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

export interface FeedData {
  id: string;
  title: string;
  summary?: string;
  publicationDate: Date;
  source: string;
  author: string;
  url: string;
  imageUrl?: string;
}

export abstract class FeedScraper {
  abstract source: string;
  abstract homepageUrl: string;

  protected abstract parseHome($: CheerioAPI): FeedData[];

  async fetchWebsiteData(): Promise<FeedData[]> {
    const response = await axios.get(this.homepageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    const html = new TextDecoder('utf-8').decode(Buffer.from(response?.data));
    const $ = load(html);

    return this.parseHome($);
  }
}
