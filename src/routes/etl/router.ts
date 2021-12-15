import express from 'express';
import controller from './controller';

const etl = express.Router();

import auth from '@middleware/auth';

etl.post(
  '/createUser',
  auth({ protect: true, isAdmin: true }),
  controller['/createUser'].post
);
etl.post(
  '/addUserToLinks',
  auth({ protect: true, isAdmin: true }),
  controller['/addUserToLinks'].post
);

export default etl;
