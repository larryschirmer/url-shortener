import { Request, Response, NextFunction } from 'express';

import { getLinkWhere, updateLinkWhere } from '@utils/dbio';

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      const { slug } = req.params;
      try {
        // fetch
        const shortLink = await getLinkWhere({ slug });
        if (!shortLink?._id) throw new Error('slug is not in use');

        //resolution
        res.redirect(shortLink.url);
        const currentTime = new Date().toISOString();
        updateLinkWhere(
          { slug },
          { $push: { opens: currentTime } }
        );
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
