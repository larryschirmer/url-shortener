import express from 'express';
import controller from './controller';

const slugCRUD = express.Router();

slugCRUD.get('/url/:slug', controller['/url'].get);
slugCRUD.post('/url', controller['/url'].post);
slugCRUD.put('/url', controller['/url'].put);
slugCRUD.delete('/url', controller['/url'].delete);

export default slugCRUD;
