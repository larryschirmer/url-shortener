import { Request, Response, NextFunction } from 'express';

import { gen } from '@utils/hash';
import { decodeUser } from '@utils/token';

import User, { TUser } from '@db/users';

const controller = {
  '/createUser': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      try {
        // validation
        if (!body.token) {
          return res.status(400).json({ error: 'Not Logged In' });
        }
        const userName = decodeUser(body.token);
        const user = (await User.findOne({ name: userName })) ?? ({} as TUser);
        if (!user.isAdmin) {
          return res
            .status(400)
            .json({ error: 'provided user or password is not correct' });
        }

        // validate new user info
        const { name, password } = body;
        if (
          !name ||
          !password ||
          typeof name !== 'string' ||
          typeof password !== 'string'
        ) {
          return res.status(400).json({ error: 'missing user or password' });
        }
        const foundUser = await User.findOne({ name });
        if (foundUser !== null) {
          return res.status(400).json({ error: 'user already exists' });
        }

        // create user
        const hash = await gen(password);
        const newUser: TUser = { name, password: hash, isAdmin: false };
        await User.create(newUser);

        //resolution
        res.json({ success: true });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
