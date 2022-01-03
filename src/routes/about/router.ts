import express from 'express';
import controller from './controller';

const about = express.Router();

about.get('/', controller['/'].get);

export default about;
