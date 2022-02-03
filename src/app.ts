import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import rootRouter from './router';

const app: Application = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/', rootRouter);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  next();
});

export default app;
