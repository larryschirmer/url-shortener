import { connect } from 'mongoose';

import logger from '@utils/logger';

const dbConnect = async () => {
  try {
    await connect(
      `${
        process.env.MONGO_URI || 'localhost'
      }/urlShortener`
    );
  } catch (e) {
    logger.error(e);
  }
};

export default dbConnect;
