import { TUser } from '@db/users';
import Url, { TUrl } from '@db/urls';

type PopulatedUrl = TUrl & { _id: string; user?: TUser };

const getAdminLinks = async () => {
  let links: PopulatedUrl[] = [];
  try {
    links = await Url.find({ isListed: true })
      .populate<PopulatedUrl[]>('user', 'isAdmin')
      .orFail()
      .then((links: PopulatedUrl[]) => {
        return links
          .filter((link: PopulatedUrl) => link?.user?.isAdmin ?? false)
          .map(
            ({ _id, name, slug, url, isListed, isFavorite, tags, opens }) => {
              return {
                _id,
                name,
                slug,
                url,
                isListed,
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
