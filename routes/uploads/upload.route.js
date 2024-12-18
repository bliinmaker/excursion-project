import {
	uploadImage,
} from '../../controllers/upload.controller.js'

export default async function (fastify, opts) {
	fastify.post('/image', uploadImage)
}