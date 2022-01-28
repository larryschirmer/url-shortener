import mongoose, { Schema } from 'mongoose';

import { Url } from './types';

const UrlSchema = new Schema<Url>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  url: { type: String, required: true },
  isListed: { type: Boolean, required: true },
  isFavorite: { type: Boolean, default: false },
  description: { type: String },
  tags: { type: [String], required: true },
  opens: { type: [String], required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

export { default as urlSchema } from './schema';
export type { Url as TUrl } from './types';

export default mongoose.model<Url>('Url', UrlSchema);
