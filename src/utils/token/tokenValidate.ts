import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || '';

/**
 * Takes a signed jwt token
 *
 * Returns true if the token is valid
 *
 * @param {string} token
 * @returns boolean
 */
const tokenValidate = (token: string) => {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
};

export default tokenValidate;
