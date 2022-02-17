import { Request, Response, NextFunction } from 'express';

import { compare } from '@utils/hash';
import { tokenGenerate } from '@utils/token';
import parseError from '@utils/parseError';
import { getUser } from '@utils/dbio';

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      const { user } = req.body;
      try {
        res.json({ name: user.name, isAdmin: user.isAdmin });
      } catch (e) {
        next(parseError(e));
      }
    },
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name, password } = body;
      try {
        // validation
        if (!name || !password) {
          return res.status(400).json({ error: 'missing user or password' });
        }
        const user = await getUser({ name });
        const isValidPassword = await compare(password, user?.password ?? '');
        if (!user?._id || name !== user?.name || !isValidPassword) {
          return res
            .status(400)
            .json({ error: 'provided user or password is not correct' });
        }

        const token = tokenGenerate({ name: user.name });

        //resolution
        res
          .header('Access-Control-Expose-Headers', 'token')
          .set('token', token)
          .json({ success: true });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
