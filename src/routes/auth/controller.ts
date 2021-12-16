import { Request, Response, NextFunction } from 'express';

import User from '@db/users';
import { compare } from '@utils/hash';
import { tokenGenerate } from '@utils/token';

const controller = {
  '/': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name, password } = body;
      try {
        // validation
        if (!name || !password) {
          return res.status(400).json({ error: 'missing user or password' });
        }
        const user = await User.findOne({ name });
        const isValidPassword = await compare(password, user?.password ?? '');
        if (name !== user?.name || !isValidPassword) {
          return res
            .status(400)
            .json({ error: 'provided user or password is not correct' });
        }

        const token = tokenGenerate({ name });

        //resolution
        res.json({ token });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
