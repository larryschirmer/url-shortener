import { ICollection } from 'monk';

import { Url } from './types';
import db from '../dninit';

let collection: ICollection<Url>;
const Url = () => {
  if (collection) return collection;

  collection = db.get<Url>('urls');
  collection.createIndex('slug', { unique: true });

  return collection;
};

export { default as urlSchema } from './schema';

export default Url();
