import { Request, Response, NextFunction } from 'express';

import { gen } from '@utils/hash';

const user = process.env.MASTER_USER || '';
const password = process.env.MASTER_PASSWORD || '';

const controller = {
  '/': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      try {
        // validation
        if (!body.user || !body.password) {
          return res.status(400).json({ error: 'missing user or password' });
        } else if (body.user !== user || body.password !== password) {
          return res
            .status(400)
            .json({ error: 'provided user or password is not correct' });
        }

        const hashedPassword = await gen(body.password);

        //resolution
        res
          .setHeader('Access-Control-Allow-Headers', 'Set-Cookie')
          .cookie('charming-smile', hashedPassword, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .json({ message: 'Successfully Signed In' });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
