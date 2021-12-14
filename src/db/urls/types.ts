import { ObjectId } from 'mongoose';

export type Url = {
  name: string;
  slug: string;
  url: string;
  isListed: boolean;
  tags: string[];
  opens: string[];
  user?: ObjectId | string;
};
