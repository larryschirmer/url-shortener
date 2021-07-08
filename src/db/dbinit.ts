import monk, { IMonkManager } from 'monk';

let connection: IMonkManager;
const db = () => {
  if (connection) return connection;

  connection = monk(process.env.MONGO_URI || 'localhost/urlShortener');
  return connection;
};

export default db();
