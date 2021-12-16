import { TUser } from '@db/users';
import Url, { TUrl } from '@db/urls';

const getAdminLinks = async () => {
  type PopulatedUrl = TUrl & { _id: string; user?: TUser };

  let links: PopulatedUrl[] = [];
  try {
    links = await Url.find({ isListed: true })
      .populate<PopulatedUrl[]>('user', 'isAdmin')
      .orFail()
      .then((links: PopulatedUrl[]) => {
        return links
          .filter((link: PopulatedUrl) => link?.user?.isAdmin ?? false)
          .map(({ _id, name, slug, url, isListed, tags, opens }) => {
            return { _id, name, slug, url, isListed, tags, opens };
          });
      });
  } catch (e) {
    links = [];
  }
  return links;
};

export default getAdminLinks;
