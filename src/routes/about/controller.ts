import { Request, Response, NextFunction } from 'express';

import parseError from '@utils/parseError';

export const aboutProperties = {
  name: 'URL Shortener',
  description: 'A URL shortener built with Node.js and Express.js',
  author: 'Larry Schirmer',
  license: 'MIT',
  version: '1.0.7',
  releaseNotes: 'Use user name in jwt token'
};

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.json(aboutProperties);
      } catch (e) {
        next(parseError(e));
      }
    }
  }
};

export default controller;
