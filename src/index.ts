import logger from '@utils/logger';
import dbConnect from '@db/dbinit';
import app from './app';

dbConnect();

const port = process.env.PORT || 1337;
app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);
});
