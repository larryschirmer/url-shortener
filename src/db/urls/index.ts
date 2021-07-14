import { ICollection } from 'monk';

import { Url } from './types';
import db from '../dbinit';

let collection: ICollection<Url>;
const url = () => {
  if (collection) return collection;

  collection = db.get<Url>('urls');
  collection.createIndex('slug', { unique: true });

  return collection;
};

export { default as urlSchema } from './schema';
export { Url as Url } from './types';

export default url();
