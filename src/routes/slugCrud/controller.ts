import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

import urls, { urlSchema, Url } from '@db/urls';

const controller = {
  '/:id': {
    get: async (req: Request, res: Response) => {
      const { id: slug } = req.params;
      try {
        const url = await urls.findOne({ slug });
        if (url) res.redirect(url.url);
        else res.redirect(`/?error=${slug} not found`);
      } catch (e) {
        res.redirect(`/?error=Link%20not%20found`);
      }
    }
  },
  '/url': {
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { slug, url } = body;
      try {
        // construction
        const newShortLink: Url = {
          slug: slug || nanoid(5).toLowerCase(),
          url
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
          e.message = 'Slug in use. 🍔';
        }
        next(e);
      }
    },
    put: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { _id, url, slug } = body;

      try {
        if (!_id) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await urls.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // construction
        const newShortLink: Url = {
          slug: slug || shortLink?.slug,
          url: url || shortLink?.url
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
    }
  }
};

export default controller;
