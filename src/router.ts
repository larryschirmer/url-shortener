import express from 'express';

import slugCRUD from '@routes/slugCrud';

const rootRouter = express.Router();

rootRouter.use('/', slugCRUD);

export default rootRouter;
