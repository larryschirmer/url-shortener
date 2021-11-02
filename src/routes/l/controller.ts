import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';

import urls, { urlSchema, Url } from '@db/urls';

const controller = {
  '/': {
    get: async (req: Request, res: Response, next: NextFunction) => {
      
    }
  }
};

export default controller;