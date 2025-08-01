import { Request, Response, NextFunction } from 'express';

import * as feedService from './feed.service';

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
