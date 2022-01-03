import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import Url from '@db/urls';
import User, { TUser } from '@db/users';

import parseError from '@utils/parseError';

type TUserDoc = TUser & { _id: Types.ObjectId };

const controller = {
  '/favorite': {
    put: async (
      { params, body }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { linkId } = params;
      const { user }: { user: TUserDoc } = body;

      try {
        // fetch
        const link = await Url.findById(linkId);
        if (!link) throw new Error('Link not found');

        // validation
        if (link?.user?.toString() !== user._id.toString())
          throw new Error('Unauthorized');

        // update
        const userUpdate = { favorites: [linkId] };
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: userUpdate },
          { new: true, projection: '-_id name favorites isAdmin' }
        ).lean();

        // resolution
        res.json(updatedUser);
      } catch (e) {
        next(parseError(e));
      }
    },
    delete: async (
      { params, body }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { linkId } = params;
      const { user }: { user: TUserDoc } = body;

      try {
        // fetch
        const link = await Url.findById(linkId);
        if (!link) throw new Error('Link not found');

        // validation
        if (link?.user?.toString() !== user._id.toString())
          throw new Error('Unauthorized');

        // update
        const userUpdate = { favorites: [linkId] };
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pullAll: userUpdate },
          { new: true, projection: '-_id name favorites isAdmin' }
        ).lean();

        // resolution
        res.json(updatedUser);
      } catch (e) {
        next(parseError(e));
      }
    }
  }
};

export default controller;
