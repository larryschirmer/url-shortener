import { Request, Response, NextFunction } from 'express';

import about, { aboutProperties } from '@routes/about/controller';

describe('About', () => {
  it('should return the about page', async () => {
    const req = {} as Request;
    const res = {} as Response;
    res.json = jest.fn();
    const next = jest.fn() as NextFunction;

    await about['/'].get(req, res, next);

    expect(res.json).toBeCalledWith(aboutProperties);
  });
});
