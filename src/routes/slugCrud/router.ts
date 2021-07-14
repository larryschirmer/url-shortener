import express from 'express';
import controller from './controller';

const slugCRUD = express.Router();

slugCRUD.get('/:id', controller['/:id'].get);
slugCRUD.post('/url', controller['/url'].post);
slugCRUD.put('/url', controller['/url'].put);

export default slugCRUD;
