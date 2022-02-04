import bcrypt from 'bcrypt';

const compare = async (password: string, hash: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

export default compare;
