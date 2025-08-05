import Feed from './feed.model';
import { FeedScraperService } from './feed.scraper.service';
import type { FeedData } from './scrapers/feed.scraper';

jest.mock('./scrapers/elpais.scraper');
jest.mock('./scrapers/elmundo.scraper');

describe('feed.scraper.service', () => {
  let service: FeedScraperService;

  beforeEach(() => {
    service = new FeedScraperService();
    jest.clearAllMocks();
  });

  it('Should call fetchWebsiteData for each scraper and save feeds', async () => {
    const mockFeeds: FeedData[] = [
      {
        id: '1',
        url: 'url1',
        title: 'Title 1',
        source: 'Source 1',
        author: 'Author 1',
        publicationDate: new Date(),
      },
      {
        id: '2',
        url: 'url2',
        title: 'Title 2',
        source: 'Source 2',
        author: 'Author 1',
        imageUrl: 'imageurl',
        publicationDate: new Date(),
      },
    ];
    for (const scraper of service['scrapers']) {
      jest.spyOn(scraper, 'fetchWebsiteData').mockResolvedValue(mockFeeds);
    }

    const findOneAndUpdateMock = jest
      .spyOn(Feed, 'findOneAndUpdate')
      .mockResolvedValue(null as unknown as ReturnType<typeof Feed.findOneAndUpdate>);
    await service.scrapeAndSaveAll();

    for (const scraper of service['scrapers']) {
      expect(scraper.fetchWebsiteData).toHaveBeenCalled();
    }

    expect(findOneAndUpdateMock).toHaveBeenCalledTimes(
      mockFeeds.length * service['scrapers'].length,
    );
  });
});
