import sub from 'date-fns/sub';
import { Types } from 'mongoose';

import UrlModel, { Url } from '@db/urls';

type UrlWithOpenAmt = Url & { openAmt: number };

const getUserLinks = async (userId: string) => {
  let links: UrlWithOpenAmt[] = [];
  try {
    links = await UrlModel.aggregate([
      { $match: { user: new Types.ObjectId(userId) } },
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

export default getUserLinks;
