import express from 'express';

import slugCRUD from '@routes/slugCrud';
import links from '@routes/links';
import auth from '@routes/auth';

const rootRouter = express.Router();

rootRouter.use('/url', slugCRUD);
rootRouter.use('/', links);
rootRouter.use('/auth', auth);

export default rootRouter;
