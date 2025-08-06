import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User, IUser } from './auth.model';

const JWT_SECRET: string = process.env.JWT_SECRET || '';

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class AuthService {
  async create(username: string, email: string, password: string): Promise<void> {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new HttpError('User already exists', 409);
    }

    const user = new User({ username, email, password });
    await user.save();
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<IUser> }> {
    const user = await User.findOne({ email });
    if (!user) throw new HttpError('User not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new HttpError('Wrong credentials', 401);

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return { token, user: userData };
  }
}
