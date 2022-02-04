import { Types } from 'mongoose';

import UrlModel from '@db/urls';

const addUserToLinks = async (userId: string) => {
  await UrlModel.updateMany(
    { user: { $exists: false } },
    { $set: { user: new Types.ObjectId(userId) } }
  );
};

export default addUserToLinks;
