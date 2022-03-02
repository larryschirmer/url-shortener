import { FilterQuery } from 'mongoose';

import UrlModel, { Url } from '@db/urls';

const findLinksWhere = async (select: FilterQuery<Url>) => {
  return await UrlModel.find(select);
};

export default findLinksWhere;
