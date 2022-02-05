import { FilterQuery } from 'mongoose';

import UrlModel, { Url } from '@db/urls';

const findLinkWhere = async (select: FilterQuery<Url>) => {
  return await UrlModel.findOne(select);
};

export default findLinkWhere;
