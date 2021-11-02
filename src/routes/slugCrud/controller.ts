import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

import urls, { urlSchema, Url } from '@db/urls';

const isTag = (word: string) => word[0] === '#';

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      const { slug } = req.params;
      try {
        // fetch
        const shortLink = await urls.findOne({ slug });
        if (!shortLink?._id) throw new Error('slug is not in use');

        //resolution
        const currentTime = new Date().toISOString();
        await urls.findOneAndUpdate(
          { slug },
          { $push: { opens: currentTime } }
        );
        res.redirect(shortLink.url);
      } catch (e) {
        next(e);
      }
    },
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name: linkName = 'Unnamed', slug, url, isListed = false } = body;
      try {
        // construction
        const newShortLink: Url = {
          name: linkName,
          slug: slug || nanoid(5).toLowerCase(),
          url,
          isListed,
          tags: linkName.split(' ').filter(isTag),
          opens: []
        };

        // validation
        await urlSchema.validate(newShortLink);

        // resolution
        const createdShortLink = await urls.insert(newShortLink);
        res.json(createdShortLink);
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
      const { _id, name: linkName = 'Unnamed', url, isListed = false, slug } = body;

      try {
        if (!_id) throw new Error('`_id` is required');

        // fetch
        const shortLink = await urls.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // construction
        const newShortLink: Url = {
          name: linkName,
          slug: slug || shortLink?.slug,
          url: url || shortLink?.url,
          isListed,
          tags: linkName.split(' ').filter(isTag),
          opens: []
        };

        // validation
        await urlSchema.validate(newShortLink);
        const conflictingShortLink = await urls.findOne({
          slug: newShortLink.slug
        });
        if (
          conflictingShortLink?._id !== undefined &&
          conflictingShortLink?._id.toString() !== shortLink?._id.toString()
        ) {
          throw new Error('slug already in use');
        }

        // resolution
        const updatedShortLink = await urls.findOneAndUpdate(
          { _id },
          { $set: newShortLink }
        );
        res.json(updatedShortLink);
      } catch (e) {
        next(e);
      }
    },
    delete: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { _id } = body;

      try {
        if (!_id) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await urls.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // resolution
        await urls.findOneAndDelete({ _id });
        res.json({});
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
