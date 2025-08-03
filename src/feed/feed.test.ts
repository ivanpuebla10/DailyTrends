import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app';

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
    source: 'Test Source',
    url: 'https://testweb.com/data1',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image1.jpg',
  },
  {
    title: 'Feed 1',
    summary: 'Summary 1',
    author: 'Author 1',
    source: 'Source 1',
    url: 'https://testweb.com/data2',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image2.jpg',
  },
  {
    title: 'Feed 2',
    summary: 'Summary 2',
    author: 'Author 2',
    source: 'Source 2',
    url: 'https://testweb.com/data3',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image3.jpg',
  },
  {
    title: 'Feed by id',
    summary: 'Summary by id',
    author: 'Author by id',
    source: 'Source by id',
    url: 'https://testweb.com/data4',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image4.jpg',
  },
  {
    title: 'Feed to update',
    summary: 'Summary to update',
    author: 'Author to update',
    source: 'Source to update',
    url: 'https://testweb.com/data5',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image5.jpg',
  },
  {
    title: 'Feed to delete',
    summary: 'Summary to delete',
    author: 'Author to delete',
    source: 'Source to delete',
    url: 'https://testweb.com/data6',
    publicationDate: new Date().toISOString(),
    creationDate: new Date(),
    imageUrl: 'https://testweb.com/image6.jpg',
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
      const res = await request(app)
        .post('/feeds')
        .send(newFeed)
        .expect('Content-Type', /json/)
        .expect(201);

      const body: IFeed = res.body;

      expect(body).toHaveProperty('_id');
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
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET ALL', () => {
    it('Should return an array of feeds', async () => {
      const feed1: Omit<IFeed, '_id' | 'id'> = DATA[1];
      const feed2: Omit<IFeed, '_id' | 'id'> = DATA[2];

      await request(app).post('/feeds').send(feed1);
      await request(app).post('/feeds').send(feed2);

      const res = await request(app).get('/feeds').expect('Content-Type', /json/).expect(200);
      const body: IFeed[] = res.body;

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET BY ID', () => {
    it('Should return a feed by id', async () => {
      const feed: Omit<IFeed, '_id' | 'id'> = DATA[3];
      const { body: newFeed } = await request(app).post('/feeds').send(feed).expect(201);
      const id: string = newFeed.id;

      const res = await request(app).get(`/feeds/${id}`).expect('Content-Type', /json/).expect(200);
      const body: IFeed = res.body;

      expect(body).toHaveProperty('_id', id);
      expect(body.title).toBe(feed.title);
    });

    it('Should return 404 if feed not found', async () => {
      const id = new mongoose.Types.ObjectId();

      await request(app).get(`/feeds/${id}`).expect(404);
    });

    it('Should return 400 if invalid id', async () => {
      const id = 'invalidId';

      await request(app).get(`/feeds/${id}`).expect(400);
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
        .expect('Content-Type', /json/)
        .expect(200);
      const body: IFeed = res.body;

      expect(body).toHaveProperty('_id', id);
      expect(body.title).toBe(updatedData.title);
    });

    it('Should return 404 with a non-existing id', async () => {
      const id = new mongoose.Types.ObjectId();

      await request(app).put(`/feeds/${id}`).send({ title: 'Title' }).expect(404);
    });

    it('Should return 400 if invalid id', async () => {
      const id = 'invalidId';

      await request(app).put(`/feeds/${id}`).expect(400);
    });
  });

  describe('DELETE', () => {
    it('Should delete a feed by id', async () => {
      const feedToDelete: Omit<IFeed, '_id' | 'id'> = DATA[5];
      const { body: newFeed } = await request(app).post('/feeds').send(feedToDelete).expect(201);
      const id: string = newFeed._id;

      await request(app).delete(`/feeds/${id}`).expect(204);

      await request(app).get(`/feeds/${id}`).expect(404);
    });

    it('Should return 404 with a non-existing id', async () => {
      const id = new mongoose.Types.ObjectId();

      await request(app).delete(`/feeds/${id}`).expect(404);
    });

    it('Should return 400 if invalid id', async () => {
      const id = 'invalidId';

      await request(app).delete(`/feeds/${id}`).expect(400);
    });
  });
});
