import { test } from 'tap'
import { build } from '../helper.js'

let id = '';

test('Comments Routes', async (t) => {
  const app = await build(t)

  t.teardown(async () => {
    await app.close()
  })

  t.test('POST /comments/:excursionId adds a new comment', async (st) => {
    const response = await app.inject({
      method: 'POST',
      url: '/comments/66fe333dd0ab035a25ecbb10',
      payload: {
        nickName: 'nickName',
        message: 'message'
      }
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const comment = JSON.parse(response.body)
    id = comment;
    st.end()
  })

  t.test('DELETE /comments/:id delete comment', async (st) => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/comments/66fe333dd0ab035a25ecbb10`
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const comment = JSON.parse(response.body)
    st.end()
  })

  t.test('GET /comments retrieves comments', async (st) => {
    const response = await app.inject({
      method: 'GET',
      url: `/comments`
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const comments = JSON.parse(response.body)
    st.ok(Array.isArray(comments), 'Response is an array of comments')
    st.end()
  })
})