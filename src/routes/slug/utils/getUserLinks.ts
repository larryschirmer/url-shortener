import Url, { TUrl } from '@db/urls';

const getUserLinks = async (userId: string) => {
  let links: TUrl[] = [];
  try {
    links = await Url.find({ user: userId })
      .orFail()
      .then((links) => {
        return links.map(
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
              isFavorite,
              description,
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

export default getUserLinks;
