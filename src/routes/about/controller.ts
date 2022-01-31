import { Request, Response, NextFunction } from 'express';

import parseError from '@utils/parseError';

const about = {
  name: 'URL Shortener',
  description: 'A URL shortener built with Node.js and Express.js',
  author: 'Larry Schirmer',
  license: 'MIT',
  version: '1.0.5',
  releaseNotes: 'Add support for link descriptions'
};

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(about);
      } catch (e) {
        next(parseError(e));
      }
    }
  }
};

export default controller;
