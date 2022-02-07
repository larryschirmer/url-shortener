import { Request, Response, NextFunction } from 'express';

import etl from '@routes/etl/controller';
import { getUser, createUser, addUserToLinks } from '@utils/dbio';
import { gen } from '@utils/hash';
import { UserDocument } from '@db/users/types';

jest.mock('@utils/dbio/user/getUser');
jest.mock('@utils/dbio/user/createUser');
jest.mock('@utils/dbio/url/addUserToLinks');
jest.mock('@utils/hash/gen');

const getUserMock = getUser as jest.Mock<ReturnType<typeof getUser>>;
const createUserMock = createUser as jest.Mock<ReturnType<typeof createUser>>;
const addUserToLinksMock = addUserToLinks as jest.Mock<
  ReturnType<typeof addUserToLinks>
>;
const genMock = gen as jest.Mock<ReturnType<typeof gen>>;

describe('ETL', () => {
  const req = {} as Request;
  req.body = {};
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  const next = jest.fn() as NextFunction;

  describe('createUser', () => {
    it('should return error if body is missing args', async () => {
      await etl['/createUser'].post(req, res, next);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'Missing User or Password' });
    });

    it('should return error if user already exists', async () => {
      req.body = { name: 'name', password: 'password' };

      getUserMock.mockResolvedValue({ _id: 'user-id' } as UserDocument);

      await etl['/createUser'].post(req, res, next);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'User Already Exists' });
    });

    it('should return success', async () => {
      req.body = { name: 'name', password: 'password' };

      getUserMock.mockResolvedValue(null);
      genMock.mockResolvedValue('password');
      createUserMock.mockResolvedValue();

      await etl['/createUser'].post(req, res, next);
      expect(res.json).toBeCalledWith({ success: true });
    });
  });

  describe('addUserToLinks', () => {
    it('should return error if userId is missing', async () => {
      await etl['/addUserToLinks'].post(req, res, next);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'Missing User Id' });
    });

    it('should return error if user does not exist', async () => {
      req.body = { userId: 'user-id' };

      getUserMock.mockResolvedValue(null);

      await etl['/addUserToLinks'].post(req, res, next);
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({ error: 'User Does Not Exist' });
    });

    it('should return success', async () => {
      req.body = { userId: 'user-id' };

      getUserMock.mockResolvedValue({ _id: 'user-id' } as UserDocument);
      addUserToLinksMock.mockResolvedValue();

      await etl['/addUserToLinks'].post(req, res, next);
      expect(res.json).toBeCalledWith({ success: true });
    });
  });
});
