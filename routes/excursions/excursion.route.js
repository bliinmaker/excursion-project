import {
	postExcursion,
	getExcursion,
	getExcursions,
	removeExcursion,
	getRateExcursion,
	postRateExcursion,
} from '../../controllers/excursion.controller.js'

export default async function (fastify, opts) {
	// excursion
	fastify.get('/', getExcursions)

	fastify.get('/:id', getExcursion)

	fastify.post('/', postExcursion)

	fastify.delete('/:id', removeExcursion)

	// rating
	fastify.get('/:id/rating', getRateExcursion)

	fastify.post('/:id/rating', postRateExcursion)
}
