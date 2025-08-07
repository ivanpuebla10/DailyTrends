import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app';

import { User, IUser } from './auth.model';

interface CreatePayload {
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

let mongoServer: MongoMemoryServer;

describe('Auth', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('CREATE USER', () => {
    it('Should create a new user with correct data', async () => {
      const payload: CreatePayload = {
        username: 'user',
        email: 'user@test.com',
        password: 'Avalidandstrongpass',
      };
      const res = await request(app).post('/auth/create').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User successfully created');
    });

    it('Should return error if email already exists', async () => {
      const payload: CreatePayload = {
        username: 'user1',
        email: 'user1@test.com',
        password: 'Avalidandstrongpass',
      };
      await User.create(payload as IUser);
      const res = await request(app).post('/auth/create').send(payload);

      expect(res.status).toBe(409);
      expect(res.body.error.message).toBe('User already exists');
    });

    it('Should return error if password is too short', async () => {
      const payload: CreatePayload = {
        username: 'erroruser',
        email: 'erroruser@test.com',
        password: 'abc',
      };
      const res = await request(app).post('/auth/create').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.errors.password).toBe('Password must be at least 8 characters long.');
    });
  });

  describe('LOGIN', () => {
    const userData: CreatePayload = {
      username: 'userlogin',
      email: 'userlogin@est.com',
      password: 'Testpassword123',
    };

    beforeEach(async () => {
      await request(app).post('/auth/create').send(userData);
    });

    it('Should login and return token with correct data', async () => {
      const payload: LoginPayload = {
        email: userData.email,
        password: userData.password,
      };
      const res = await request(app).post('/auth/login').send(payload);

      expect(res.status).toBe(200);
      expect(typeof res.body.token).toBe('string');
      expect(res.body.user).toHaveProperty('username', userData.username);
    });

    it('Should return error with wrong password', async () => {
      const payload: LoginPayload = {
        email: userData.email,
        password: 'WrongPassword',
      };
      const res = await request(app).post('/auth/login').send(payload);

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Wrong credentials');
    });

    it('Should return if user does not exist', async () => {
      const payload: LoginPayload = {
        email: 'nonexistent@test.com',
        password: 'password1234',
      };
      const res = await request(app).post('/auth/login').send(payload);

      expect(res.status).toBe(404);
      expect(res.body.error.message).toBe('User not found');
    });

    it('Should return error without password', async () => {
      const payload = { email: userData.email };
      const res = await request(app).post('/auth/login').send(payload);

      expect(res.status).toBe(400);
      expect(res.body.errors).toHaveProperty('password');
    });
  });
});
