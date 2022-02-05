import { User } from '@db/users';
import UrlModel, { Url } from '@db/urls';

type PopulatedUrl = Url & { _id: string; user?: User };

const getAdminLinks = async () => {
  let links: PopulatedUrl[] = [];
  try {
    links = await UrlModel.find({ isListed: true })
      .populate<PopulatedUrl[]>('user', 'isAdmin')
      .orFail()
      .then((links: PopulatedUrl[]) => {
        return links
          .filter((link: PopulatedUrl) => link?.user?.isAdmin ?? false)
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
