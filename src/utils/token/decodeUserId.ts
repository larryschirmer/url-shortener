import jwt from 'jsonwebtoken';

/**
 * Takes a signed jwt token
 *
 * Returns the user's id or null
 *
 * @param {string} token - signed jwt token
 * @returns ?string
 */
const decodeUserId = (token: string) => {
  const decoded = jwt.decode(token);
  if (typeof decoded === 'string' || decoded === null) return null;
  return decoded.id;
};

export default decodeUserId;
