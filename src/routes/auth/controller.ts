import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '@db/users';
import { compare } from '@utils/hash';

const controller = {
  '/': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      try {
        // validation
        if (!body.name || !body.password) {
          return res.status(400).json({ error: 'missing user or password' });
        }
        const user = await User.findOne({ name: body.name });
        const isValidPassword = await compare(
          body.password,
          user?.password ?? ''
        );
        if (body.name !== user?.name || !isValidPassword) {
          return res
            .status(400)
            .json({ error: 'provided user or password is not correct' });
        }

        const secret = process.env.TOKEN_SECRET || '';
        const token = jwt.sign({ name: body.name }, secret, {
          expiresIn: '1y'
        });

        //resolution
        res.json({ token });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
