import UrlModel, { Url } from '@db/urls';

const createLink = async (newLink: Url) => {
  const createdLink = await UrlModel.create(newLink).then(
    (link) => link.toObject()
  );

  return createdLink;
};

export default createLink;
