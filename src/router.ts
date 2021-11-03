import express from 'express';

import slugCRUD from '@routes/slugCrud';
import link from '@routes/l';
import auth from '@routes/auth';

const rootRouter = express.Router();

rootRouter.use('/url', slugCRUD);
rootRouter.use('/l', link);
rootRouter.use('/auth', auth);

export default rootRouter;
