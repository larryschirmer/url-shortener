import * as yup from 'yup';

import { Url } from './types';

const schema: yup.SchemaOf<Omit<Url, 'user'>> = yup.object({
  name: yup.string().required(),
  slug: yup.string().trim().matches(/[\w-]/i).required(),
  url: yup.string().trim().url().required(),
  isListed: yup.boolean().required(),
  isFavorite: yup.boolean().default(false),
  tags: yup.array().of(yup.string().required()),
  opens: yup.array().of(yup.string().required())
});

export default schema;
