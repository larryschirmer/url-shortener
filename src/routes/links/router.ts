import express from 'express';
import controller from './controller';

const link = express.Router();

link.get('/:slug', controller['/'].get);

export default link;
