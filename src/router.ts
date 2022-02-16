import express from 'express';

import about from '@routes/about';
import auth from '@routes/auth';
import admin from '@routes/admin';
import links from '@routes/links';
import slug from '@routes/slug';

const rootRouter = express.Router();

rootRouter.use('/about', about);
rootRouter.use('/auth', auth);
rootRouter.use('/slug', slug);
rootRouter.use('/admin', admin);
rootRouter.use('/', links);

export default rootRouter;
