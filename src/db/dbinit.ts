import monk, { IMonkManager } from 'monk';

import logger from '@utils/logger';

let connection: Promise<IMonkManager> & IMonkManager;
const db = () => {
  if (connection) return connection;

  connection = monk(process.env.MONGO_URI || 'localhost/urlShortener');

  connection.catch(() => {
    logger.error('db failed to connect');
  });

  return connection;
};

export default db();
