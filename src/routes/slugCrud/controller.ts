import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

import urls, { urlSchema, Url } from '@db/urls';
import { gen, compare } from '@utils/hash';

const password = process.env.MASTER_PASSWORD || '';

const isTag = (word: string) => word[0] === '#';

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      try {
        // fetch
        const shortLinks = await urls.find();

        //resolution
        res.json(shortLinks);
      } catch (e) {
        next(e);
      }
    },
    post: async (
      { body, cookies }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { name: linkName = '', slug, url, isListed = false } = body;
      try {
        // validate cookie
        const cookie = cookies['charming-smile'] as string;
        if (!cookie) throw new Error('Not Logged In');
        const isValidCookie = await compare(cookie);
        if (!isValidCookie) throw new Error('Not Logged In');

        // construction
        const newShortLink: Url = {
          name: linkName.length ? linkName : 'Unnamed',
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
        const hashedPassword = await gen(password);
        res
          .cookie('charming-smile', hashedPassword, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .json(createdShortLink);
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
    put: async (
      { body, cookies }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { _id, name: linkName, url, isListed = false, slug } = body;

      try {
        // validate cookie
        const cookie = cookies['charming-smile'] as string;
        if (!cookie) throw new Error('Not Logged In');
        const isValidCookie = await compare(cookie);
        if (!isValidCookie) throw new Error('Not Logged In');

        if (!_id) throw new Error('`_id` is required');

        // fetch
        const shortLink = await urls.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // construction
        const newShortLink: Url = {
          name: linkName || shortLink.name,
          slug: slug || shortLink.slug,
          url: url || shortLink.url,
          isListed: isListed || shortLink.isListed,
          tags: (linkName || shortLink.name).split(' ').filter(isTag),
          opens: shortLink.opens
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
        const hashedPassword = await gen(password);
        res
          .cookie('charming-smile', hashedPassword, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .json(updatedShortLink);
      } catch (e) {
        next(e);
      }
    },
    delete: async (
      { body, cookies }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { _id } = body;

      try {
        // validate cookie
        const cookie = cookies['charming-smile'] as string;
        if (!cookie) throw new Error('Not Logged In');
        const isValidCookie = await compare(cookie);
        if (!isValidCookie) throw new Error('Not Logged In');

        if (!_id) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await urls.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // resolution
        await urls.findOneAndDelete({ _id });
        const hashedPassword = await gen(password);
        res
          .cookie('charming-smile', hashedPassword, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .json({});
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
