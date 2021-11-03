import bcrypt from 'bcrypt';

export const gen = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const compare = async (hash: string): Promise<boolean> => {
  const password = process.env.MASTER_PASSWORD || '';
  const result = await bcrypt.compare(password, hash);
  return result;
};
