import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || '';

export const tokenGenerate = (body: { user: string }) => {
  return jwt.sign({ user: body.user }, secret, {
    expiresIn: '7d'
  });
};

export const tokenValidate = (token: string) => {
  try {
    jwt.verify(token, secret);
  } catch (e) {
    throw new Error('Not Logged In');
  }
};

export const decodeUser = (token: string): string | undefined => {
  tokenValidate(token);
  const decoded = jwt.decode(token);
  if (typeof decoded === 'string' || decoded === null)
    throw new Error('Not Logged In');
  return decoded.name;
};
