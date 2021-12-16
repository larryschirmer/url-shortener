import express from 'express';

import slug from '@routes/slug';
import auth from '@routes/auth';
import etl from '@routes/etl';
import links from '@routes/links';

const rootRouter = express.Router();

rootRouter.use('/slug', slug);
rootRouter.use('/auth', auth);
rootRouter.use('/etl', etl);
rootRouter.use('/', links);

export default rootRouter;
