import * as cheerio from 'cheerio';

import { ElMundoScraper } from './elmundo.scraper';

describe('elmundo.scraper', () => {
  let scraper: ElMundoScraper;

  beforeEach(() => {
    scraper = new ElMundoScraper();
  });

  it('Should extract publicationDate from url', () => {
    const url = 'https://www.elmundo.es/2025/08/04/noticia.html';
    const publicationDate = scraper['extractDateFromUrl'](url);

    expect(publicationDate).toBeInstanceOf(Date);
    expect(publicationDate.getFullYear()).toBe(2025);
    expect(publicationDate.getMonth()).toBe(7);
    expect(publicationDate.getDate()).toBe(4);
  });

  it('parseHome should extract feeds with correct properties', () => {
    const html = `
      <article ue-article-id="123">
        <header><a href="https://www.elmundo.es/2025/08/04/feed.html"><h2>Test title</h2></a></header>
        <div class="ue-c-cover-content__byline-name"><a>Test author</a></div>
        <figure><img src="https://elmundo.es/image.jpg"/></figure>
      </article>
    `;
    const $ = cheerio.load(html);
    const feeds = scraper['parseHome']($);

    expect(Array.isArray(feeds)).toBe(true);
    expect(feeds.length).toBe(1);
    expect(feeds[0]).toMatchObject({
      id: '123',
      title: 'Test title',
      author: 'Test author',
      source: 'El Mundo',
      url: 'https://www.elmundo.es/2025/08/04/feed.html',
      imageUrl: 'https://elmundo.es/image.jpg',
      publicationDate: expect.any(Date),
    });
  });
});
