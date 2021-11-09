import { Request, Response, NextFunction } from 'express';

const frontendDomain = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';

const ALLOWED_ORIGINS = [frontendDomain];

const dynamicCors = (req: Request, res: Response, next: NextFunction) => {
  const { origin = '' } = req.headers;
  const theOrigin =
    ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.header('Access-Control-Allow-Origin', theOrigin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  next();
};

export default dynamicCors;
