import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

import urls, { urlSchema, UrlT } from '@db/urls';

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
          // TODO: organize error messages
          e.message = 'Slug in use. 🍔';
        }
        next(e);
      }
    }
  }
};

export default controller;
