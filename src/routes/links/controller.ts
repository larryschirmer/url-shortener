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
        const currentTime = new Date().toISOString();
        await updateLinkWhere(
          { slug },
          { $push: { opens: currentTime } }
        );
        res.redirect(shortLink.url);
      } catch (e) {
        next(e);
      }
    }
  }
};

export default controller;
