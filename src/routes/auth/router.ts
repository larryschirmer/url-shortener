import express from 'express';
import controller from './controller';

import { authenticate } from '@middleware/index';

const auth = express.Router();

auth.get('/', authenticate({ protect: true }), controller['/'].get);
auth.post('/', controller['/'].post);

export default auth;
