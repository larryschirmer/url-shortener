import { Request, Response, NextFunction } from 'express';

import { User } from '@db/users/types';
import { tokenValidate, decodeUserId } from '@utils/token';
import { getUser } from '@utils/dbio';

const authenticate =
  ({ protect = false, isAdmin = false } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader) token = authHeader.split(' ')[1];

    try {
      // validate token
      if (token) {
        const isValid = tokenValidate(token);
        if (!isValid) throw new Error('Invalid Token');
      }
      // protect routes
      if (protect && !token) throw new Error('Not Logged In');
      // get user
      let user: User | null = null;
      if (token) {
        const userId = decodeUserId(token);
        user = await getUser({ id: userId });
        if (!user) throw new Error('Username is not found');
        req.body.user = user;
      }
      // protect admin routes
      if (isAdmin && !user?.isAdmin) throw new Error('Not Authorized');

      next();
    } catch (e) {
      if (e instanceof Error) res.status(401).json({ error: e.message });
      else res.status(401).json({ error: e });
    }
  };

export default authenticate;
