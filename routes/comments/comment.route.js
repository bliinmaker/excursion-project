import {
	getComments,
	postComment,
	removeComment,
} from '../../controllers/comment.controller.js'

export default async function (fastify, opts) {
	fastify.get('/', getComments)

	fastify.post('/:excursionId', postComment)

	fastify.delete('/:id', removeComment)
}
