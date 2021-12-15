import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

import User from '@db/users';
import Url, { urlSchema, TUrl } from '@db/urls';

import { tokenGenerate, tokenValidate, decodeUser } from '@utils/token';
import { getUserLinks, getAdminLinks } from './utils';

const isTag = (word: string) => word[0] === '#';

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      const user = req.body.user;
      try {
        // fetch
        let links: TUrl[] = [];
        if (user) links = await getUserLinks(user._id);
        else links = await getAdminLinks();

        //resolution
        res.json(links);
      } catch (e) {
        next(e);
      }
    },
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name: linkName = '', slug, url, isListed = false, token } = body;
      try {
        // construction
        const userName = decodeUser(token) ?? '';
        const user = await User.findOne({ name: userName });
        const newShortLink: TUrl = {
          name: linkName.length ? linkName : 'Unnamed',
          slug: slug || nanoid(5).toLowerCase(),
          url,
          isListed,
          tags: linkName.split(' ').filter(isTag),
          opens: [],
          user: new Types.ObjectId(user?._id)
        };

        // validation
        await urlSchema.validate(newShortLink);

        // resolution
        const createdShortLink = await Url.create(newShortLink);
        const newToken = tokenGenerate({ name: userName });
        res.json({ ...createdShortLink.toJSON(), token: newToken });
      } catch (e) {
        if (
          e instanceof Error &&
          e.message.includes('duplicate key error collection')
        ) {
          e.message = 'Slug in use.';
        }
        next(e);
      }
    },
    put: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { _id, name: linkName, url, isListed = false, slug, token } = body;
      try {
        // validate token
        if (!token) throw new Error('Not Logged In');
        tokenValidate(token);

        if (!_id) throw new Error('`_id` is required');

        // fetch
        const shortLink = await Url.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // construction
        const newShortLink: TUrl = {
          name: linkName || shortLink.name,
          slug: slug || shortLink.slug,
          url: url || shortLink.url,
          isListed: isListed || shortLink.isListed,
          tags: (linkName || shortLink.name).split(' ').filter(isTag),
          opens: shortLink.opens,
          user: shortLink.user
        };

        // validation
        await urlSchema.validate(newShortLink);
        const conflictingShortLink = await Url.findOne({
          slug: newShortLink.slug
        });
        if (
          conflictingShortLink?._id !== undefined &&
          conflictingShortLink?._id.toString() !== shortLink?._id.toString()
        ) {
          throw new Error('slug already in use');
        }

        // resolution
        const updatedShortLink = await Url.findOneAndUpdate(
          { _id },
          { $set: newShortLink }
        ).lean();

        const userName = decodeUser(token) ?? '';
        const newToken = tokenGenerate({ name: userName });
        res.json({ ...updatedShortLink, token: newToken });
      } catch (e) {
        next(e);
      }
    },
    delete: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { _id, token } = body;

      try {
        // validate token
        if (!token) throw new Error('Not Logged In');
        tokenValidate(token);

        if (!_id) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await Url.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // resolution
        await Url.findOneAndDelete({ _id });
        const userName = decodeUser(token) ?? '';
        const newToken = tokenGenerate({ name: userName });
        res.json({ token: newToken });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
