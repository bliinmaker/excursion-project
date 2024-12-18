import { test } from 'tap'
import { build } from '../helper.js'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImVtYWlsIjoidGVzdEBtYWlsLnJ1IiwiZmlyc3ROYW1lIjoiS2lyaWxsIiwibGFzdE5hbWUiOiJJbm96ZW10c2V2Iiwicm9sZSI6IkFkbWluIn0sImlhdCI6MTczNDQ1NDQ2MX0.uY6SQ6kv4eWIT24VCx-ymxeJKu1iBb44Jz8kQXKoO_A";
let id = '';
test('User Routes', async (t) => {
    const app = await build(t)

    t.teardown(async () => {
        await app.close()
    })

    t.test('POST /users creates a new user', async (st) => {
        const response = await app.inject({
            method: 'POST',
            url: '/users/',
            payload: {
                firstName: 'New',
                lastName: 'User',
                email: 'newTestUser@example.com',
                password: 'securepassword123'
            }
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        const user = JSON.parse(response.body)
        id = user._id
        st.ok(user._id, 'User created with an ID')
        st.end()
    })

    t.test('GET /users get all users', async (st) => {
        const response = await app.inject({
            method: 'GET',
            url: '/users/',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        st.end()
    })

    t.test('GET /users/:id get user by ID', async (st) => {
        const response = await app.inject({
            method: 'GET',
            url: `/users/${id}`
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        st.end()
    })

    t.test('PUT /users/:id update user by ID', async (st) => {
        const response = await app.inject({
            method: 'PUT',
            url: `/users/${id}`,
            payload: {
                firstName: 'New',
                lastName: 'User',
                email: 'newTestUserUpdate@example.com',
                password: 'securepassword123'
            }
        })

        st.equal(response.statusCode, 200, 'Returns 200 status')
        st.end()
    })

    t.test('DELETE /users/:id delete user by ID', async (st) => {
        const response = await app.inject({
            method: 'DELETE',
            url: `/users/${id}`
        })

        st.equal(response.statusCode, 204, 'Returns 204 status')
        st.end()
    })

    t.test('POST /users/login authenticates user', async (st) => {

        const loginResponse = await app.inject({
            method: 'POST',
            url: '/users/login',
            payload: {
                email: "test@mail.ru",
                password: "password123"
            },
        })

        st.equal(loginResponse.statusCode, 200, 'Returns 200 status')
        const loginResult = JSON.parse(loginResponse.body)
        console.log(loginResponse.body)
        st.ok(loginResult.token, 'Login returns a token')
        st.end()
    })
})