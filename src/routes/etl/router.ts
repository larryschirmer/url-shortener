import express from 'express';
import controller from './controller';

const auth = express.Router();

auth.post('/createUser', controller['/createUser'].post);

export default auth;
