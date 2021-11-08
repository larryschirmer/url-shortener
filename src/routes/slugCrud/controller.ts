import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

import urls, { urlSchema, Url } from '@db/urls';

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
    post: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { name: linkName = '', slug, url, isListed = false } = body;
      try {
        // validate token
        if (!body.token) throw new Error('Not Logged In');
        const secret = process.env.TOKEN_SECRET || '';
        try {
          jwt.verify(body.token, secret);
        } catch (e) {
          throw new Error('Not Logged In');
        }

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
        const token = jwt.sign({ user: body.user }, secret, {
          expiresIn: '1d'
        });
        res.json({ ...createdShortLink, token });
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
      const { _id, name: linkName, url, isListed = false, slug } = body;

      try {
        // validate token
        if (!body.token) throw new Error('Not Logged In');
        const secret = process.env.TOKEN_SECRET || '';
        try {
          jwt.verify(body.token, secret);
        } catch (e) {
          throw new Error('Not Logged In');
        }

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

        const token = jwt.sign({ user: body.user }, secret, {
          expiresIn: '1d'
        });
        res.json({ ...updatedShortLink, token });
      } catch (e) {
        next(e);
      }
    },
    delete: async ({ body }: Request, res: Response, next: NextFunction) => {
      const { _id } = body;

      try {
        // validate token
        if (!body.token) throw new Error('Not Logged In');
        const secret = process.env.TOKEN_SECRET || '';
        try {
          jwt.verify(body.token, secret);
        } catch (e) {
          throw new Error('Not Logged In');
        }

        if (!_id) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await urls.findOne({ _id });
        if (!shortLink?._id) throw new Error('id is not in use');

        // resolution
        await urls.findOneAndDelete({ _id });
        const token = jwt.sign({ user: body.user }, secret, {
          expiresIn: '1d'
        });
        res.json({ token });
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
