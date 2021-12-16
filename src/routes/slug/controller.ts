import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

import Url, { urlSchema, TUrl } from '@db/urls';

import { tokenGenerate } from '@utils/token';
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
      const { name: linkName = '', slug, url, isListed = false, user } = body;
      try {
        // construction
        const isAdmin = user?.isAdmin;
        const newShortLink: TUrl = {
          name: linkName.length ? linkName : 'Unnamed',
          slug: slug || nanoid(5).toLowerCase(),
          url,
          isListed: isAdmin ? isListed : false,
          tags: linkName.split(' ').filter(isTag),
          opens: [],
          user: new Types.ObjectId(user?._id)
        };

        // validation
        await urlSchema.validate(newShortLink);

        // resolution
        const createdShortLink = await Url.create(newShortLink);
        const newToken = tokenGenerate({ name: user.name });
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
      const { _id, name: linkName, url, isListed = false, slug, user } = body;
      try {
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

        const newToken = tokenGenerate({ name: user.name });
        res.json({ ...updatedShortLink, token: newToken });
      } catch (e) {
        next(e);
      }
    },
    delete: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { _id, user } = body;

      try {
        if (!_id) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await Url.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // resolution
        await Url.findOneAndDelete({ _id });
        const newToken = tokenGenerate({ name: user.name });
        res.json({ token: newToken });
      } catch (e) {
        next(e);
      }
    }
  },
  '/isValid': {
    get: async ({ query }: Request, res: Response, next: NextFunction) => {
      const { slug } = query;
      try {
        if (!slug) throw new Error('`slug` is required');
        const query = { slug: Array.isArray(slug) ? slug[0] : slug };
        if (typeof query.slug !== 'string')
          throw new Error('`slug` is invalid');

        const reservedSlugs = ['slug', 'auth', 'etl'];
        if (reservedSlugs.includes(query.slug)) {
          res.json({ isValid: false });
          return;
        }

        const isValid = await Url.findOne(query);
        res.json({ isValid: !isValid });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
