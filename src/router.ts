import express from 'express';

import slugCRUD from '@routes/slugCrud';
import auth from '@routes/auth';
import etl from '@routes/etl';
import links from '@routes/links';

const rootRouter = express.Router();

rootRouter.use('/url', slugCRUD);
rootRouter.use('/auth', auth);
rootRouter.use('/etl', etl);
rootRouter.use('/', links);

export default rootRouter;
