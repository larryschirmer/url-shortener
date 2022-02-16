import express from 'express';
import controller from './controller';

import { authenticate } from '@middleware/index';

const admin = express.Router();

admin.post(
  '/createUser',
  authenticate({ protect: true, isAdmin: true }),
  controller['/createUser'].post
);
admin.post(
  '/addUserToLinks',
  authenticate({ protect: true, isAdmin: true }),
  controller['/addUserToLinks'].post
);

export default admin;
