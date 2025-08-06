import { Request, Response, NextFunction } from 'express';

import { AuthService } from './auth.service';

const authService = new AuthService();

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    await authService.create(username, email, password);

    res.status(201).json({ message: 'User successfully created' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};
