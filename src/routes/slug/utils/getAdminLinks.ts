import sub from 'date-fns/sub';

import UrlModel, { Url } from '@db/urls';

type UrlWithOpenAmt = Url & { openAmt: number };

const getAdminLinks = async () => {
  let links: UrlWithOpenAmt[] = [];
  try {
    links = await UrlModel.aggregate([
      { $match: { isListed: true } },
      {
        $project: {
          name: 1,
          slug: 1,
          url: 1,
          isListed: 1,
          isFavorite: { $ifNull: ['$isFavorite', false] },
          description: 1,
          tags: 1,
          openAmt: {
            $size: '$opens'
          },
          opens: {
            $filter: {
              input: '$opens',
              as: 'opens',
              cond: {
                $gt: ['$$opens', sub(new Date(), { days: 29 }).toISOString()]
              }
            }
          }
        }
      }
    ]);
  } catch (e) {
    links = [];
  }
  return links;
};

export default getAdminLinks;
