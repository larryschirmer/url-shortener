import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

import Url, { urlSchema, TUrl } from '@db/urls';

import parseError from '@utils/parseError';
import { getUserLinks, getAdminLinks, isInUse } from './utils';

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
        next(parseError(e));
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
        if (await isInUse(newShortLink.slug))
          throw new Error('Slug is already in use');

        // resolution
        await Url.create(newShortLink);
        const createdShortLink = await Url.findOne(
          { slug: newShortLink.slug },
          '-__v -user'
        ).lean();

        res.json(createdShortLink);
      } catch (e) {
        next(parseError(e));
      }
    },
    put: async (
      { params, body }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { linkId } = params;
      const { name: linkName, url, isListed, slug, user } = body;

      try {
        if (!linkId) throw new Error('`_id` is required');
        if (await isInUse(slug)) throw new Error('Slug is already in use');

        // fetch
        const shortLink = await Url.findOne({ _id: linkId });
        if (!shortLink) throw new Error('id is not in use');

        // construction
        const isAdmin = user?.isAdmin;
        const newShortLink: TUrl = {
          name: linkName || shortLink.name,
          slug: slug || shortLink.slug,
          url: url || shortLink.url,
          isListed: isAdmin ? isListed ?? shortLink.isListed : false,
          tags: (linkName || shortLink.name).split(' ').filter(isTag),
          opens: shortLink.opens,
          user: shortLink.user
        };

        // validation
        await urlSchema.validate(newShortLink);

        // resolution
        await Url.findOneAndUpdate({ _id: linkId }, { $set: newShortLink });
        const updatedShortLink = await Url.findOne(
          { _id: linkId },
          '-__v -user'
        ).lean();

        res.json(updatedShortLink);
      } catch (e) {
        next(parseError(e));
      }
    },
    delete: async ({ params }: Request, res: Response, next: NextFunction) => {
      const { linkId } = params;

      try {
        if (!linkId) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await Url.findOne({ _id: linkId });
        if (!shortLink) throw new Error('id is not in use');

        // resolution
        await Url.findOneAndDelete({ _id: linkId });

        res.json({ success: true });
      } catch (e) {
        next(parseError(e));
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

        const isInvalid = await isInUse(query.slug);
        res.json({ isValid: !isInvalid });
      } catch (e) {
        next(parseError(e));
      }
    }
  }
};

export default controller;
