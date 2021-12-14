import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || '';

export const tokenGenerate = (body: { name: string }) => {
  return jwt.sign({ user: body.name }, secret, {
    expiresIn: '1y'
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
