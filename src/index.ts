import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import monk from 'monk';

const db = monk(process.env.MONGO_URI || 'localhost/urlShortener');
const urls = db.get('urls');
urls.createIndex('slug', { unique: true });

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/:id', async (req, res) => {
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) res.redirect(url.url);
    else res.redirect(`/?error=${slug} not found`);
  } catch (e) {
    res.redirect(`/?error=Link%20not%20found`);
  }
});

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req: Request, res: Response, next: NextFunction) => {
  const { name, url } = req.body;
  try {
    // validation
    await schema.validate({ name, url });

    // construction
    const slug: string = (!!name ? name : nanoid(5)).toLowerCase();
    const newUrl = { url, slug };

    // resolution
    const createdUrl = await urls.insert(newUrl);
    res.json(createdUrl);
  } catch (e) {
    if (e instanceof Error && e.message.includes('duplicate key error collection')) {
      e.message = 'Slug in use. 🍔';
    }
    next(e);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
