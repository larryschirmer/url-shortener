/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { gen } = require('../build/utils/hash');

const [password] = process.argv.slice(2);

if (!password) {
  // eslint-disable-next-line no-console
  console.error('Password is required');
  process.exit(1);
}

(async () => {
  const hash = await gen(password);
  // eslint-disable-next-line no-console
  console.log(hash);
})();
