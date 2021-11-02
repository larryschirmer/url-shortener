import express from 'express';

import slugCRUD from '@routes/slugCrud';
import link from '@routes/l';

const rootRouter = express.Router();

rootRouter.use('/url', slugCRUD);
rootRouter.use('/l', link);

export default rootRouter;
