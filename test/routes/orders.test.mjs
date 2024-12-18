import { test } from 'tap'
import { build } from '../helper.js'

let id = '';

test('Orders Routes', async (t) => {
    const app = await build(t)

    t.teardown(async () => {
        await app.close()
    })

    t.test('POST /orders creates a new order', async (st) => {
        const response = await app.inject({
        method: 'POST',
        url: '/orders',
        payload: {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '89567807890',
            excursion: '66fe333dd0ab035a25ecbb10',
        }
        })

        st.equal(response.statusCode, 200, 'Returns 201 status')
        const order = JSON.parse(response.body)
        id = order._id
        st.ok(order._id, 'Order created with an ID')
        st.end()
    })

    t.test('GET /orders get all orders', async (st) => {
        const response = await app.inject({
            method: 'GET',
            url: '/orders',
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        st.end()
    })

    t.test('GET /orders/:id get order by id', async (st) => {
        const response = await app.inject({
            method: 'GET',
            url: `/orders/${id}`,
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        st.end()
    })
    t.test('DELETE /orders/:id delete order by id', async (st) => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/orders/${id}`,
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        st.end()
    })
})