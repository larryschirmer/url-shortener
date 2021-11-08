import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import logger from '@utils/logger';

import rootRouter from './router';

const app = express();

const apiDomain = process.env.API_DOMAIN || 'http://localhost:1337';
const frontendDomain = process.env.FRONTEND_DOMAIN || 'http://localhost:3000';

const corsOptions: CorsOptions = {
  origin: [apiDomain, frontendDomain]
};

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/', rootRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
  next();
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});
