import express from 'express';
import controller from './controller';

import authMiddle from '@middleware/auth';

const auth = express.Router();

auth.get('/', authMiddle({ protect: true }), controller['/'].get);
auth.post('/', controller['/'].post);

export default auth;
