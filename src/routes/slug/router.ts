import express from 'express';
import controller from './controller';

import authMiddle from '@middleware/auth';

const slug = express.Router();

slug.get('/', authMiddle(), controller['/'].get);
slug.post('/', authMiddle({ protect: true }), controller['/'].post);
slug.put('/:linkId', authMiddle({ protect: true }), controller['/'].put);
slug.delete('/:linkId', authMiddle({ protect: true }), controller['/'].delete);
slug.put('/favorite/:linkId', authMiddle({ protect: true }), controller['/favorite'].put);
slug.delete('/favorite/:linkId', authMiddle({ protect: true }), controller['/favorite'].put);
slug.get('/isValid', controller['/isValid'].get);

export default slug;
