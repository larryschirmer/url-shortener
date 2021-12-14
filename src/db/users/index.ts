import mongoose, { Schema } from 'mongoose';

import { User } from './types';

const UserSchema = new Schema<User>({
  name: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
});

export { default as userSchema } from './schema';
export type { User } from './types';

export default mongoose.model<User>('User', UserSchema);
