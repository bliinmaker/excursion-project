import { test } from 'tap'
import { build } from '../helper.js'

let id = '';

test('Excursions Routes', async (t) => {
  const app = await build(t)

  t.teardown(async () => {
    await app.close()
  })

  t.test('GET /excursions returns all excursions', async (st) => {
    const response = await app.inject({
      method: 'GET',
      url: '/excursions'
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    st.ok(Array.isArray(JSON.parse(response.body)), 'Response is an array')
    st.end()
  })

  t.test('POST /excursions returns specific excursion', async (st) => {
    const response = await app.inject({
      method: 'POST',
      url: `/excursions`,
      payload: {
        title: 'Test Excursion',
        theme: 'Test City',
        description: 'A test excursion for automated testing',
        date: '01.01.2025',
        rating: 5,
        duration: '2 hours',
        image: '1'
      }
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const excursion = JSON.parse(response.body)
    id = excursion._id
    st.end()
  })

  t.test('GET /excursions/:id returns specific excursion', async (st) => {
    const response = await app.inject({
      method: 'GET',
      url: `/excursions/${id}`
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const excursion = JSON.parse(response.body)
    st.end()
  })

  t.test('POST /excursions/:id/rating post rating excursion', async (st) => {
    const response = await app.inject({
      method: 'POST',
      url: `/excursions/${id}/rating`,
      payload: {
        rating: 5
      }
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const excursion = JSON.parse(response.body)
    st.end()
  })

  t.test('GET /excursions/:id/rating get rating excursion', async (st) => {
    const response = await app.inject({
      method: 'GET',
      url: `/excursions/${id}/rating`
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const rating = JSON.parse(response.body)
    st.end()
  })

  t.test('DELETE /excursions/:id delete excursion', async (st) => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/excursions/${id}`
    })

    st.equal(response.statusCode, 200, 'Returns 200 status')
    const excursion = JSON.parse(response.body)
    st.end()
  })
})