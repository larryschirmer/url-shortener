import * as yup from 'yup';

import { User } from './types';

const schema: yup.SchemaOf<User> = yup.object({
  name: yup.string().required(),
  password: yup.string().required(),
});

export default schema;
