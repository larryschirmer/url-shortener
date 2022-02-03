import express from 'express';
import controller from './controller';

import { authenticate } from '@middleware/index';

const etl = express.Router();

etl.post(
  '/createUser',
  authenticate({ protect: true, isAdmin: true }),
  controller['/createUser'].post
);
etl.post(
  '/addUserToLinks',
  authenticate({ protect: true, isAdmin: true }),
  controller['/addUserToLinks'].post
);

export default etl;
