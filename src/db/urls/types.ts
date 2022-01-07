import { Types } from 'mongoose';

export type Url = {
  name: string;
  slug: string;
  url: string;
  isListed: boolean;
  isFavorite?: boolean;
  tags: string[];
  opens: string[];
  user?: Types.ObjectId;
};
