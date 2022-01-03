import * as yup from 'yup';

import { User } from './types';

const schema: yup.SchemaOf<User> = yup.object({
  name: yup.string().required(),
  password: yup.string().required(),
  favorites: yup.array(yup.string().required()),
  isAdmin: yup.boolean()
});

export default schema;
