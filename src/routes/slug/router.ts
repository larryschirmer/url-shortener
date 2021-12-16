import express from 'express';
import controller from './controller';

const slug = express.Router();

import auth from '@middleware/auth';

slug.get('/', auth(), controller['/'].get);
slug.post('/', auth({ protect: true }), controller['/'].post);
slug.put('/', auth({ protect: true }), controller['/'].put);
slug.delete('/', auth({ protect: true }), controller['/'].delete);
slug.get('/isValid', controller['/isValid'].get);

export default slug;
