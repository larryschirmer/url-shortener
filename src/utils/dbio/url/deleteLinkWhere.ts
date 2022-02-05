import { FilterQuery } from 'mongoose';

import UrlModel, { Url } from '@db/urls';

const deleteLinkWhere = async (select: FilterQuery<Url>) => {
  await UrlModel.findOneAndDelete(select);
};

export default deleteLinkWhere;
