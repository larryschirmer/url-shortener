import express from 'express';
import controller from './controller';

import authMiddle from '@middleware/auth';

const user = express.Router();

user.put(
  '/favorite/:linkId',
  authMiddle({ protect: true }),
  controller['/favorite'].put
);
user.delete(
  '/favorite/:linkId',
  authMiddle({ protect: true }),
  controller['/favorite'].delete
);

export default user;
