import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Request, Response, NextFunction } from 'express';

import app from '../app';

jest.mock('../middlewares/authenticate', () => ({
  authenticate: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

interface IFeed {
  _id: string;
  id: string;
  title: string;
  summary?: string;
  author?: string;
  source: string;
  url: string;
  publicationDate: string;
  creationDate: Date;
  imageUrl?: string;
}

const DATA: Omit<IFeed, '_id' | 'id'>[] = [
  {
    title: 'First feed',
    summary: 'Summary not too long',
    author: 'Author One',
    source: 'El País',
    url: 'https://testweb.com/data1',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image1.jpg',
  },
  {
    title: 'Feed 1',
    summary: 'Summary 1',
    author: 'Author 1',
    source: 'El País',
    url: 'https://testweb.com/data2',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image2.jpg',
  },
  {
    title: 'Feed 2',
    summary: 'Summary 2',
    author: 'Author 2',
    source: 'El País',
    url: 'https://testweb.com/data3',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image3.jpg',
  },
  {
    title: 'Feed 3',
    summary: 'Summary 3',
    author: 'Author 3',
    source: 'El País',
    url: 'https://testweb.com/data4',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image4.jpg',
  },
  {
    title: 'Feed 4',
    summary: 'Summary 4',
    author: 'Author 4',
    source: 'El País',
    url: 'https://testweb.com/data5',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image5.jpg',
  },
  {
    title: 'Feed by id',
    summary: 'Summary by id',
    author: 'Author by id',
    source: 'El Mundo',
    url: 'https://testweb.com/data4',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image4.jpg',
  },
  {
    title: 'Feed to update',
    summary: 'Summary to update',
    author: 'Author to update',
    source: 'El Mundo',
    url: 'https://testweb.com/data5',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image5.jpg',
  },
  {
    title: 'Feed to delete',
    summary: 'Summary to delete',
    author: 'Author to delete',
    source: 'El Mundo',
    url: 'https://testweb.com/data6',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image6.jpg',
  },
  {
    title: 'Feed 5',
    summary: 'Summary 5',
    author: 'Author 5',
    source: 'El Mundo',
    url: 'https://testweb.com/data7',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image7.jpg',
  },
  {
    title: 'Feed 6',
    summary: 'Summary 6',
    author: 'Author 6',
    source: 'El Mundo',
    url: 'https://testweb.com/data8',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image8.jpg',
  },
];

let mongoServer: MongoMemoryServer;

describe('Feed', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('CREATE', () => {
    it('Should create a feed with correct data', async () => {
      const newFeed: Omit<IFeed, '_id' | 'id'> = DATA[0];
      const res = await request(app).post('/feeds').send(newFeed).expect('Content-Type', /json/);

      const body: IFeed = res.body;

      expect(res.status).toBe(201);
      expect(body).toHaveProperty('id');
      expect(body.title).toBe(newFeed.title);
      expect(body.summary).toBe(newFeed.summary);
    });

    it('Should return error with invalid data', async () => {
      const invalidFeed = {
        title: '',
        summary: '',
        publicationDate: 'invalid-date',
      };
      const res = await request(app)
        .post('/feeds')
        .send(invalidFeed)
        .expect('Content-Type', /json/);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET ALL', () => {
    it('Should return an array of feeds', async () => {
      const feed1: Omit<IFeed, '_id' | 'id'> = DATA[1];
      const feed2: Omit<IFeed, '_id' | 'id'> = DATA[2];

      await request(app).post('/feeds').send(feed1);
      await request(app).post('/feeds').send(feed2);

      const res = await request(app).get('/feeds').expect('Content-Type', /json/);
      const body: IFeed[] = res.body;

      expect(res.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET BY ID', () => {
    it('Should return a feed by id', async () => {
      const feed: Omit<IFeed, '_id' | 'id'> = DATA[3];
      const { body: newFeed } = await request(app).post('/feeds').send(feed).expect(201);
      const id: string = newFeed.id;

      const res = await request(app).get(`/feeds/${id}`).expect('Content-Type', /json/);
      const body: IFeed = res.body;

      expect(res.status).toBe(200);
      expect(body).toHaveProperty('_id', id);
      expect(body.title).toBe(feed.title);
    });

    it('Should return 404 if feed not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/feeds/${id}`);

      expect(res.status).toBe(404);
    });

    it('Should return 400 if invalid id', async () => {
      const id = 'invalidId';
      const res = await request(app).get(`/feeds/${id}`);

      expect(res.status).toBe(400);
    });
  });

  describe('UPDATE', () => {
    it('Should update a feed by id', async () => {
      const feedToUpdate: Omit<IFeed, '_id' | 'id'> = DATA[4];
      const { body: newFeed } = await request(app).post('/feeds').send(feedToUpdate).expect(201);
      const id: string = newFeed.id;
      const updatedData = { title: 'Feed updated' };
      const res = await request(app)
        .put(`/feeds/${id}`)
        .send(updatedData)
        .expect('Content-Type', /json/);
      const body: IFeed = res.body;

      expect(res.status).toBe(200);
      expect(body).toHaveProperty('_id', id);
      expect(body.title).toBe(updatedData.title);
    });

    it('Should return 404 with a non-existing id', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).put(`/feeds/${id}`).send({ title: 'Title' });

      expect(res.status).toBe(404);
    });

    it('Should return 400 if invalid id', async () => {
      const id = 'invalidId';
      const res = await request(app).put(`/feeds/${id}`);

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE', () => {
    it('Should delete a feed by id', async () => {
      const feedToDelete: Omit<IFeed, '_id' | 'id'> = DATA[5];
      const { body: newFeed } = await request(app).post('/feeds').send(feedToDelete).expect(201);
      const id: string = newFeed._id;

      await request(app).delete(`/feeds/${id}`).expect(204);

      const res = await request(app).get(`/feeds/${id}`);

      expect(res.status).toBe(404);
    });

    it('Should return 404 with a non-existing id', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/feeds/${id}`);

      expect(res.status).toBe(404);
    });

    it('Should return 400 if invalid id', async () => {
      const id = 'invalidId';
      const res = await request(app).delete(`/feeds/${id}`);

      expect(res.status).toBe(400);
    });
  });

  describe('SCRAPING', () => {
    it('Should execute scraping and respond successfully', async () => {
      const res = await request(app).post('/feeds/scrape').expect('Content-Type', /json/);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Scraping successfully executed' });

      const feeds = await request(app).get('/feeds').expect('Content-Type', /json/);
      const body: IFeed[] = feeds.body;

      expect(feeds.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });

  describe('TOP 10', () => {
    beforeEach(async () => {
      for (const feed of DATA) {
        await request(app).post('/feeds').send(feed).expect(201);
      }
    });

    it('Should return last feeds from El Mundo and El País, ordered by publicationDate', async () => {
      const res = await request(app).get('/feeds/top10').expect('Content-Type', /json/).expect(200);
      const body: IFeed[] = res.body;

      expect(res.status).toBe(200);
      expect(Array.isArray(body)).toBe(true);

      const sources = new Set(body.map((feed) => feed.source));
      expect(sources.has('El País')).toBe(true);
      expect(sources.has('El Mundo')).toBe(true);
      expect([...sources].every((source) => ['El País', 'El Mundo'].includes(source))).toBe(true);

      for (const source of ['El País', 'El Mundo']) {
        const feedsBySource = body.filter((feed) => feed.source === source);
        expect(feedsBySource.length).toBe(5);

        for (let i = 1; i < feedsBySource.length; i++) {
          const prevDate = new Date(feedsBySource[i - 1].publicationDate).getTime();
          const currDate = new Date(feedsBySource[i].publicationDate).getTime();
          expect(prevDate).toBeGreaterThanOrEqual(currDate);
        }
      }
    });
  });
});
