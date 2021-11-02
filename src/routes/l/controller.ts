import { Request, Response, NextFunction } from 'express';

import urls from '@db/urls';

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
    }
  }
};

export default controller;
