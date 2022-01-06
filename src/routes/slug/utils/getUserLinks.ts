import { TUser } from '@db/users';
import Url, { TUrl } from '@db/urls';

type PopulatedUrl = TUrl & { _id: string; user?: TUser };

const getUserLinks = async (userId: string) => {
  let links: PopulatedUrl[] = [];
  try {
    links = await Url.find({ user: userId })
      .populate<PopulatedUrl[]>('user', 'favorites')
      .orFail()
      .then((links: PopulatedUrl[]) => {
        return links.map(
          ({ _id, name, slug, url, isListed, tags, opens, user }) => {
            return {
              _id,
              name,
              slug,
              url,
              isListed,
              tags,
              opens,
              isFavorite: user?.favorites.includes(_id) ?? false
            };
          }
        );
      });
  } catch (e) {
    links = [];
  }
  return links;
};

export default getUserLinks;
