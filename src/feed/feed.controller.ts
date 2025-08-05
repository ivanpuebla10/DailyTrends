import { Request, Response, NextFunction } from 'express';

import * as feedService from './feed.service';
import { FeedScraperService } from './feed.scraper.service';

const scraperService = new FeedScraperService();

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const feed = await feedService.create(req.body);
    return res.status(201).json(feed);
  } catch (error) {
    return next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const feeds = await feedService.getAll();
    return res.json(feeds);
  } catch (error) {
    return next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const feed = await feedService.getById(id);
    if (!feed) return res.status(404).json({ error: 'Feed not found' });

    return res.json(feed);
  } catch (error) {
    return next(error);
  }
}

export async function updateById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const feed = await feedService.updateById(id, req.body);
    if (!feed) return res.status(404).json({ error: 'Feed not found' });

    return res.json(feed);
  } catch (error) {
    return next(error);
  }
}

export async function deleteById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  try {
    const feed = await feedService.deleteById(id);
    if (!feed) return res.status(404).json({ error: 'Feed not found' });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

export async function scrapeFeeds(req: Request, res: Response, next: NextFunction) {
  try {
    await scraperService.scrapeAndSaveAll();
    res.status(200).json({ message: 'Scraping successfully executed' });
  } catch (error) {
    next(error);
  }
}

export async function getTopFeeds(req: Request, res: Response, next: NextFunction) {
  try {
    const sources = ['El País', 'El Mundo'];
    const result = await Promise.all(
      sources.map((source) => feedService.getTopFeedsBySource(source, 5)),
    );
    const topFeeds = result.flat();

    res.status(200).json(topFeeds);
  } catch (error) {
    next(error);
  }
}
