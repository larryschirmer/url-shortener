import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { gen } from '@utils/hash';
import { decodeUser } from '@utils/token';

import User, { TUser } from '@db/users';
import Url, { urlSchema, TUrl } from '@db/urls';

const controller = {
  '/createUser': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name, password, token } = body;
      try {
        // validation
        if (!token) {
          return res.status(400).json({ error: 'Not Logged In' });
        }
        const userName = decodeUser(token);
        const user = (await User.findOne({ name: userName })) ?? ({} as TUser);
        if (!user.isAdmin) {
          return res
            .status(400)
            .json({ error: 'provided user or password is not correct' });
        }

        // validate new user info
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
  },
  '/addUserToLinks': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { userId, token } = body;
      try {
        // validation
        if (!token) {
          return res.status(400).json({ error: 'Not Logged In' });
        }
        const userName = decodeUser(token);
        const user = (await User.findOne({ name: userName })) ?? ({} as TUser);
        if (!user.isAdmin) {
          return res
            .status(400)
            .json({ error: 'Not Authorized' });
        }

        // validate that provided user exists
        if (!userId || typeof userId !== 'string')
          return res.status(400).json({ error: 'user is a required field' });
        const foundUser = await User.findOne({ _id: userId });
        if (foundUser === null) {
          return res.status(400).json({ error: 'user does not exist' });
        }

        // update all links with the new user
        await Url.updateMany(
          { user: { $exists: false } },
          { $set: { user: new Types.ObjectId(userId) } }
        );

        //resolution
        res.json({ success: true });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
