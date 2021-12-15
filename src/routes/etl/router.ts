import express from 'express';
import controller from './controller';

const auth = express.Router();

auth.post('/createUser', controller['/createUser'].post);
auth.post('/addUserToLinks', controller['/addUserToLinks'].post);

export default auth;
