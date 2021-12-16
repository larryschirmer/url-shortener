import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import logger from '@utils/logger';
import dbConnect from '@db/dbinit';

import rootRouter from './router';

dbConnect();
const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/', rootRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  next();
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});
