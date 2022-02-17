import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import authenticate from '../authenticate';
import { tokenValidate, decodeUserName, tokenGenerate } from '@utils/token';
import { getUser } from '@utils/dbio';
import { UserDocument } from '@db/users/types';

jest.mock('@utils/token/tokenValidate');
jest.mock('@utils/token/decodeUserName');
jest.mock('@utils/token/tokenGenerate');
jest.mock('@utils/dbio/user/getUser');

const tokenValidateMock = tokenValidate as jest.Mock<
  ReturnType<typeof tokenValidate>
>;
const decodeUserNameMock = decodeUserName as jest.Mock<
  ReturnType<typeof decodeUserName>
>;
const tokenGenerateMock = tokenGenerate as jest.Mock<
  ReturnType<typeof tokenGenerate>
>;
const getUserMock = getUser as jest.Mock<ReturnType<typeof getUser>>;

describe('Middleware - Authenticate', () => {
  const req = {} as Request;
  req.body = {};
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.header = jest.fn().mockReturnThis();
  res.set = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  const next = jest.fn() as NextFunction;

  it('should return error if token is invalid', async () => {
    req.headers = { authorization: 'Bearer invalid-token' };

    tokenValidateMock.mockReturnValue(false);

    await authenticate()(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ error: 'Invalid Token' });
  });

  it('should return error if no token and route is protected', async () => {
    req.headers = {};

    await authenticate({ protect: true })(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ error: 'Not Logged In' });
  });

  it('should return error if user is not found', async () => {
    req.headers = { authorization: 'Bearer token' };

    tokenValidateMock.mockReturnValue(true);
    decodeUserNameMock.mockReturnValue('user-name');
    getUserMock.mockResolvedValue(null);

    await authenticate()(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ error: 'Username is not found' });
  });

  it('should set a valid user to the request body', async () => {
    req.headers = { authorization: 'Bearer token' };

    tokenValidateMock.mockReturnValue(true);
    decodeUserNameMock.mockReturnValue('user-name');
    getUserMock.mockResolvedValue({
      _id: new Types.ObjectId('a1b2c3d4e5f6')
    } as UserDocument);
    tokenGenerateMock.mockReturnValue('valid.jwt.token');

    await authenticate()(req, res, next);
    expect(req.body.user).toEqual({ _id: new Types.ObjectId('a1b2c3d4e5f6') });
    expect(res.header).toBeCalledWith('Access-Control-Expose-Headers', 'token');
    expect(res.set).toBeCalledWith('token', 'valid.jwt.token');
  });

  it('should return error if user is not an admin on protected route', async () => {
    req.headers = { authorization: 'Bearer token' };

    tokenValidateMock.mockReturnValue(true);
    decodeUserNameMock.mockReturnValue('user-name');
    getUserMock.mockResolvedValue({
      _id: new Types.ObjectId('a1b2c3d4e5f6'),
      isAdmin: false
    } as UserDocument);

    await authenticate({ isAdmin: true })(req, res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ error: 'Not Authorized' });
  });
});
