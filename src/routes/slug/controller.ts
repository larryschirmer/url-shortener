import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import { Types } from 'mongoose';

import Url, { urlSchema, TUrl } from '@db/urls';
import User, { TUser } from '@db/users';

import parseError from '@utils/parseError';
import { getUserLinks, getAdminLinks, isInUse } from './utils';

const isTag = (word: string) => word[0] === '#';

type TUserDoc = TUser & { _id: Types.ObjectId };

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
        const createdShortLinkId = await Url.create(newShortLink).then(
          (link) => link.toObject()._id
        );

        res.json({
          _id: createdShortLinkId,
          name: newShortLink.name,
          slug: newShortLink.slug,
          url: newShortLink.url,
          isListed: newShortLink.isListed,
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
      const { name: linkName, url, isListed, slug, user } = body;

      try {
        if (!linkId) throw new Error('`_id` is required');

        // fetch
        const shortLink = await Url.findOne({ _id: linkId });
        if (!shortLink) throw new Error('id is not in use');
        if (slug !== shortLink.slug && (await isInUse(slug)))
          throw new Error('Slug is already in use');

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
      { params, body }: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { linkId } = params;
      const { user }: { user: TUserDoc } = body;

      try {
        if (!linkId) throw new Error('`_id` is required');

        // fetch current short link
        const shortLink = await Url.findOne({ _id: linkId });
        if (!shortLink) throw new Error('id is not in use');

        // resolution
        await Url.findOneAndDelete({ _id: linkId });
        const userUpdate = { favorites: [linkId] };
        await User.findOneAndUpdate(
          { _id: user._id },
          { $pullAll: userUpdate }
        );

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
