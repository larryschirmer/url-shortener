import express from 'express';

import about from '@routes/about';
import auth from '@routes/auth';
import etl from '@routes/etl';
import links from '@routes/links';
import slug from '@routes/slug';

const rootRouter = express.Router();

rootRouter.use('/about', about);
rootRouter.use('/auth', auth);
rootRouter.use('/slug', slug);
rootRouter.use('/etl', etl);
rootRouter.use('/', links);

export default rootRouter;
