import User from '@db/users';

const getUser = async ({ name, id }: { name?: string; id?: string }) => {
  const user = await User.findOne({ where: { name, id } });
  return user;
};

export default getUser;
