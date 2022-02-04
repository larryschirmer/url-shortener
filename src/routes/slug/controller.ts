import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

import Url, { urlSchema, TUrl } from '@db/urls';
import { UserDocument } from '@db/users/types';

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
      const { name: linkName = '', slug, url, isListed = false, description, user } = body;

      try {
        // construction
        const isAdmin = user?.isAdmin;
        const newShortLink: TUrl = {
          name: linkName.length ? linkName : 'Unnamed',
          slug: slug || nanoid(5).toLowerCase(),
          url,
          isListed: isAdmin ? isListed : false,
          isFavorite: false,
          description: description || '',
          tags: linkName.split(' ').filter(isTag),
          opens: [],
          user: new Types.ObjectId(user?._id)
        };

        // validation
        await urlSchema.validate(newShortLink);
        if (await isInUse(newShortLink.slug))
          throw new Error('Slug is already in use');

        // resolution
        const createdShortLinkId = await Url.create(newShortLink).then(
          (link) => link.toObject()._id
        );

        res.json({
          _id: createdShortLinkId,
          name: newShortLink.name,
          slug: newShortLink.slug,
          url: newShortLink.url,
          isListed: newShortLink.isListed,
          isFavorite: newShortLink.isFavorite,
          description: newShortLink.description,
          tags: newShortLink.tags,
          opens: newShortLink.opens
        });
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
      const { name: linkName, url, isListed, description, slug, user } = body;

      try {
        if (!linkId) throw new Error('`_id` is required');

        // fetch
        const shortLink = await Url.findOne({ _id: linkId });
        if (!shortLink) throw new Error('id is not in use');
        if (
          slug !== undefined &&
          slug !== shortLink.slug &&
          (await isInUse(slug))
        )
          throw new Error('Slug is already in use');

        const newSlug = slug
          ? slug // if slug is provided, use it
          : slug === ''
          ? nanoid(5).toLowerCase() // if slug is empty, generate a random one
          : shortLink.slug; // if slug is not provided, use the existing one

        // construction
        const isAdmin = user?.isAdmin;
        const newShortLink: TUrl = {
          name: linkName || shortLink.name,
          slug: newSlug,
          url: url || shortLink.url,
          isListed: isAdmin ? isListed ?? shortLink.isListed : false,
          isFavorite: shortLink.isFavorite,
          description: description || shortLink.description,
          tags: (linkName || shortLink.name).split(' ').filter(isTag),
          opens: shortLink.opens,
          user: shortLink.user
        };

        // validation
        await urlSchema.validate(newShortLink);

        // resolution
        const updatedShortLink = await Url.findOneAndUpdate(
          { _id: linkId },
          { $set: newShortLink },
          {
            new: true,
            projection: '-__v -user'
          }
        );

        res.json(updatedShortLink);
      } catch (e) {
        next(parseError(e));
      }
    },
    delete: async (
      { params }: Request,
      res: Response,
      next: NextFunction
    ) => {
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
  '/favorite': {
    put: async (
      { params, body }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { linkId } = params;
      const {
        user,
        isFavorite
      }: { user: UserDocument; isFavorite: boolean | undefined } = body;

      try {
        if (!linkId) throw new Error('`_id` is required');
        if (isFavorite === undefined)
          throw new Error('`isFavorite` is required');

        // fetch
        const link = await Url.findById(linkId);
        if (!link) throw new Error('Link not found');

        // validation
        if (link?.user?.toString() !== user._id.toString())
          throw new Error('Unauthorized');

        // resolution
        const updatedShortLink = await Url.findOneAndUpdate(
          { _id: linkId },
          { $set: { isFavorite: isFavorite } },
          {
            new: true,
            projection: '-__v -user'
          }
        );

        res.json(updatedShortLink);
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
