import express, { Request, Response, NextFunction } from 'express';
import controller from './controller';

import { tokenValidate, decodeUser } from '@utils/token';
import User, { TUser } from '@db/users';

const slugCRUD = express.Router();

const auth =
  ({ protect = false, isAdmin = false } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader) token = authHeader.split(' ')[1];

    try {
      // validate token
      if (token) {
        if (protect) {
          if (!token) throw new Error('Not Logged In');
          tokenValidate(token);
        }
        const userName = decodeUser(token);
        const user = (await User.findOne({ name: userName })) ?? ({} as TUser);
        req.body.user = user;
        if (isAdmin && !user.isAdmin) throw new Error('Not Authorized');
      }

      next();
    } catch (e) {
      res.status(401).json({ error: e });
    }
  };

slugCRUD.get('/', auth(), controller['/'].get);
slugCRUD.post('/', controller['/'].post);
slugCRUD.put('/', controller['/'].put);
slugCRUD.delete('/', controller['/'].delete);

export default slugCRUD;
