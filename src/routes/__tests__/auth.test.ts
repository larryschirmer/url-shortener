import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { UserDocument } from '@db/users/types';
import auth from '@routes/auth/controller';
import { getUser } from '@utils/dbio';
import { compare } from '@utils/hash';
import { tokenGenerate } from '@utils/token';

jest.mock('@utils/dbio/getUser');
jest.mock('@utils/hash/compare');
jest.mock('@utils/token/tokenGenerate');

const getUserMock = getUser as jest.Mock<ReturnType<typeof getUser>>;
const compareMock = compare as jest.Mock<ReturnType<typeof compare>>;
const tokenGenerateMock = tokenGenerate as jest.Mock<
  ReturnType<typeof tokenGenerate>
>;

describe('Auth', () => {
  const req = {} as Request;
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.header = jest.fn().mockReturnThis();
  res.set = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  const next = jest.fn() as NextFunction;

  it('should return the user', async () => {
    req.body = {
      user: {
        name: 'admin',
        isAdmin: true,
        password: 'password'
      } as UserDocument
    };

    await auth['/'].get(req, res, next);
    expect(res.json).toBeCalledWith({ name: 'admin', isAdmin: true });
  });

  it('should return 400 if required data is missing', async () => {
    await auth['/'].post(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ error: 'missing user or password' });
  });

  it('should return 400 if password does not match', async () => {
    req.body = { name: 'name', password: 'password' };
    getUserMock.mockResolvedValue({
      _id: new Types.ObjectId('a1b2c3d4e5f6')
    } as UserDocument);
    compareMock.mockResolvedValue(false);

    await auth['/'].post(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      error: 'provided user or password is not correct'
    });
  });

  it('should set a valid token in the header', async () => {
    req.body = { name: 'name', password: 'password' };
    getUserMock.mockResolvedValue({
      _id: new Types.ObjectId('a1b2c3d4e5f6'),
      name: 'name',
    } as UserDocument);
    compareMock.mockResolvedValue(true);
    tokenGenerateMock.mockReturnValue('valid.jwt.token');

    await auth['/'].post(req, res, next);
    expect(res.header).toBeCalledWith('Access-Control-Expose-Headers', 'token');
    expect(res.set).toBeCalledWith('token', 'valid.jwt.token');
    expect(res.json).toBeCalledWith({ success: true });
  });
});
