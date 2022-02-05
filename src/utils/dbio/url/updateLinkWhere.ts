import { FilterQuery, UpdateQuery } from 'mongoose';

import UrlModel, { Url } from '@db/urls';

const updateLinkWhere = async (
  select: FilterQuery<Url>,
  properties: UpdateQuery<Url>,
  project: string[] = []
) => {
  const projection = ['-__v'].concat(project);
  return await UrlModel.findOneAndUpdate(select, properties, {
    new: true,
    projection: projection.join(' ')
  });
};

export default updateLinkWhere;
