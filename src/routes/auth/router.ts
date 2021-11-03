import express from 'express';
import controller from './controller';

const auth = express.Router();

auth.post('/', controller['/'].post);

export default auth;
