import { Types } from 'mongoose';

import { User } from '@db/users';
import UrlModel, { Url } from '@db/urls';

type PopulatedUrl = Url & { _id: Types.ObjectId; user?: User };

const getAdminLinks = async () => {
  let links: PopulatedUrl[] = [];
  try {
    links = await UrlModel.find({ isListed: true })
      .populate<PopulatedUrl>('user', 'isAdmin')
      .orFail()
      .then((links) => {
        return links
          .filter((link) => link?.user?.isAdmin ?? false)
          .map(
            ({
              _id,
              name,
              slug,
              url,
              isListed,
              isFavorite,
              description,
              tags,
              opens
            }) => {
              return {
                _id,
                name,
                slug,
                url,
                isListed,
                description,
                isFavorite,
                tags,
                opens
              };
            }
          );
      });
  } catch (e) {
    links = [];
  }
  return links;
};

export default getAdminLinks;
