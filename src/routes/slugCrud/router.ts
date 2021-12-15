import express from 'express';
import controller from './controller';

const slugCRUD = express.Router();

import auth from '@middleware/auth';

slugCRUD.get('/', auth(), controller['/'].get);
slugCRUD.post('/', auth({ protect: true }), controller['/'].post);
slugCRUD.put('/', auth({ protect: true }), controller['/'].put);
slugCRUD.delete('/', auth({ protect: true }), controller['/'].delete);

export default slugCRUD;
