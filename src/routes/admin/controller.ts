import { Request, Response, NextFunction } from 'express';

import { gen } from '@utils/hash';
import parseError from '@utils/parseError';
import { getUser, createUser, addUserToLinks } from '@utils/dbio';
import { User } from '@db/users';

const controller = {
  '/createUser': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name, password, isAdmin = false } = body;
      try {
        // validate new user info
        if (
          !name ||
          !password ||
          typeof name !== 'string' ||
          typeof password !== 'string'
        ) {
          return res.status(400).json({ error: 'Missing User or Password' });
        }
        const foundUser = await getUser({ name });
        if (foundUser !== null) {
          return res.status(400).json({ error: 'User Already Exists' });
        }

        // create user
        const hash = await gen(password);
        const newUser: User = { name, password: hash, isAdmin };
        await createUser(newUser);

        //resolution
        res.json({ success: true });
      } catch (e) {
        next(parseError(e));
      }
    }
  },
  '/addUserToLinks': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { userId } = body;
      try {
        // validate that provided user exists
        if (!userId || typeof userId !== 'string')
          return res.status(400).json({ error: 'Missing User Id' });
        const foundUser = await getUser({ id: userId });
        if (foundUser === null) {
          return res.status(400).json({ error: 'User Does Not Exist' });
        }

        // update all links with the new user
        await addUserToLinks(userId);

        //resolution
        res.json({ success: true });
      } catch (e) {
        next(parseError(e));
      }
    }
  }
};

export default controller;
