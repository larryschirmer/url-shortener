import Url from '@db/urls';

const isInUse = async (slug: string) => {
  if (!slug) return false;
  const reservedSlugs = ['about', 'auth', 'slug', 'admin'];
  if (reservedSlugs.includes(slug)) return true;

  const url = await Url.findOne({ slug });
  return !!url;
};

export default isInUse;
