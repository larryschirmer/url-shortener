import express from 'express';
import controller from './controller';

import authMiddle from '@middleware/auth';

const etl = express.Router();

etl.post(
  '/createUser',
  authMiddle({ protect: true, isAdmin: true }),
  controller['/createUser'].post
);
etl.post(
  '/addUserToLinks',
  authMiddle({ protect: true, isAdmin: true }),
  controller['/addUserToLinks'].post
);

export default etl;
