import express from 'express';
import controller from './controller';

import { authenticate } from '@middleware/index';

const slug = express.Router();

slug.get('/', authenticate(), controller['/'].get);
slug.post('/', authenticate({ protect: true }), controller['/'].post);
slug.put('/:linkId', authenticate({ protect: true }), controller['/'].put);
slug.delete(
  '/:linkId',
  authenticate({ protect: true }),
  controller['/'].delete
);
slug.put(
  '/favorite/:linkId',
  authenticate({ protect: true }),
  controller['/favorite'].put
);
slug.get('/isValid', controller['/isValid'].get);

export default slug;
