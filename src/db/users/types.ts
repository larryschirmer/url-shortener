import { Document, ObjectId } from 'mongoose';

export type User = {
  name: string;
  password: string;
  isAdmin?: boolean;
};

interface DocWithUser extends Document {
  name: string;
  password: string;
  isAdmin?: boolean;
}

export type UserDocument = DocWithUser & User & { _id: ObjectId };
