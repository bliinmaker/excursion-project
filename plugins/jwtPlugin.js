import fp from 'fastify-plugin'
import "dotenv";
import jwt from '@fastify/jwt'

export default fp(async function(fastify, opts) {
	fastify.register((jwt), {
		secret: process.env.JWT_SIGNING_SECRET
	})

	fastify.decorate("jwtAuth", async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.status(401).send({ message: "Unauthorized" })
		}
	})
})
