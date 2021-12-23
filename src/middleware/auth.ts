import { Request, Response, NextFunction } from 'express';

import { tokenValidate, decodeUser } from '@utils/token';
import User from '@db/users';

const auth =
  ({ protect = false, isAdmin = false } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader) token = authHeader.split(' ')[1];

    try {
      // validate token
      if (protect) {
        if (!token) throw new Error('Not Logged In');
        tokenValidate(token);
      }
      if (token) {
        const userName = decodeUser(token);
        const user = (await User.findOne({ name: userName }));
        if (!user) throw new Error('Username is not found');
        req.body.user = user;
        if (isAdmin && !user.isAdmin) throw new Error('Not Authorized');
      }

      next();
    } catch (e) {
      if (e instanceof Error) res.status(401).json({ error: e.message });
      else res.status(401).json({ error: e });
    }
  };

export default auth;
