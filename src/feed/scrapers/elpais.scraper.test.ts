import * as cheerio from 'cheerio';

import { ElPaisScraper } from './elpais.scraper';

describe('ElPaisScraper', () => {
  let scraper: ElPaisScraper;

  beforeEach(() => {
    scraper = new ElPaisScraper();
  });

  it('Should extract valid id and valid publicationDate from URL', () => {
    const url = 'https://elpais.com/2025/08/04/test-feed.html?param=1';
    const { id, publicationDate } = scraper['extractDataFromUrl'](url);

    expect(id).toHaveLength(24);
    expect(publicationDate).toBeInstanceOf(Date);
  });

  it('parseHome should extract feeds with correct properties', () => {
    const html = `<article>
      <h2 class="c_t"><a href="https://elpais.com/2025/08/04/feed.html">Titulo Test</a></h2>
      <p class="c_d">Resumen test</p>
      <div class="c_a"><a>Autor Test</a></div>
      <figure><img src="https://elpais.com/img/test.png"/></figure>
    </article>`;

    const $ = cheerio.load(html);
    const feeds = scraper['parseHome']($);

    expect(Array.isArray(feeds)).toBe(true);
    expect(feeds[0]).toMatchObject({
      title: 'Titulo Test',
      summary: 'Resumen test',
      author: 'Autor Test',
      source: 'El País',
      url: 'https://elpais.com/2025/08/04/feed.html',
      imageUrl: 'https://elpais.com/img/test.png',
    });
  });
});
