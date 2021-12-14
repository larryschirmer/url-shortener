import { connect } from 'mongoose';

import logger from '@utils/logger';

const dbConnect = async () => {
  try {
    await connect(`${process.env.MONGO_URI}/urlShortener`);
  } catch (e) {
    logger.error('Error connecting to database', e);
  }
};

export default dbConnect;
