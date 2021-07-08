import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import urls, { urlSchema, UrlT } from '../db/urls';

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
    },
  },
  '/url': {
    post: async (req: Request, res: Response, next: NextFunction) => {
      const { name, url } = req.body;
      try {
        // validation
        await urlSchema.validate({ name, url });

        // construction
        const slug: string = (!!name ? name : nanoid(5)).toLowerCase();
        const newUrl: UrlT = { url, slug };

        // resolution
        const createdUrl = await urls.insert(newUrl);
        res.json(createdUrl);
      } catch (e) {
        if (e instanceof Error && e.message.includes('duplicate key error collection')) {
          e.message = 'Slug in use. 🍔';
        }
        next(e);
      }
    },
  },
};

export default controller;
