import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || '';

/**
 * Takes the body of the new token as an object
 * that has the user id as a property
 *
 * Returns the new signed jwt token
 *
 * @param {Object} body - the body of the jwt token
 * @param {string} body.id - the id of the user
 * @returns String
 */
const tokenGenerate = (body: { name: string }) => {
  return jwt.sign({ name: body.name }, secret, {
    expiresIn: '7d'
  });
};

export default tokenGenerate;
