import * as yup from 'yup';

import { Url } from './types';

const schema: yup.SchemaOf<Url> = yup.object({
  slug: yup.string().trim().matches(/[\w-]/i).required(),
  url: yup.string().trim().url().required()
});

export default schema;
