import { test } from 'tap';
import { build } from '../helper.js';

test('Root route returns 200 status', async (t) => {
  const app = await build(t);
  
  const res = await app.inject({
    method: 'GET',
    url: '/'
  });
  
  t.equal(res.statusCode, 200, 'Root route should return 200 status');
  t.end();
});