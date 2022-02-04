import UserModel, { User } from '@db/users';

const createUser = async (user: User) => {
  await UserModel.create(user);
};

export default createUser;
