import { ICollection } from 'monk';

import { User } from './types';
import db from '../dbinit';

let collection: ICollection<User>;
const url = () => {
  if (collection) return collection;

  collection = db.get<User>('users');
  collection.createIndex('name', { unique: true });

  return collection;
};

export { default as urlSchema } from './schema';
export type { User } from './types';

export default url();
