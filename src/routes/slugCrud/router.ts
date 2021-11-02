import express from 'express';
import controller from './controller';

const slugCRUD = express.Router();

slugCRUD.get('/', controller['/'].get);
slugCRUD.post('/', controller['/'].post);
slugCRUD.put('/', controller['/'].put);
slugCRUD.delete('/', controller['/'].delete);

export default slugCRUD;
