import { Document, Types, ObjectId } from 'mongoose';

export type Url = {
  name: string;
  slug: string;
  url: string;
  isListed: boolean;
  isFavorite?: boolean;
  description?: string;
  tags: string[];
  opens: string[];
  user?: Types.ObjectId;
};

interface DocWithUrl extends Document {
  name: string;
  slug: string;
  url: string;
  isListed: boolean;
  isFavorite?: boolean;
  description?: string;
  tags: string[];
  opens: string[];
  user?: Types.ObjectId;
}

export type UrlDocument = DocWithUrl & Url & { _id: ObjectId };
