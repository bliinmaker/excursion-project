import Excursion from '../models/excursion.model.js'

export const findAll = async ({ title, theme, date }) => {
	const filter = {}

	if (title) {
		filter.title = title
	}
	if (theme) {
		filter.theme = theme
	}
	if (date) {
		filter.date = {
			$gte: new Date(date),
		}
	}

	const excursions = await Excursion.find(filter).populate([
		{
			path: 'comments',
			model: 'Comment',
		},
	])

	return excursions
}

export const findById = async id => {
	const existedExcursion = await Excursion.findById(id).populate([
		{
			path: 'comments',
			model: 'Comment',
		},
	])

	if (!existedExcursion) {
		throw new Error('Excursion does not exist!')
	}

	return existedExcursion
}

export const createExcursion = async ({
	title,
	theme,
	description,
	date,
	image,
}) => {
	const excursion = await Excursion.create({
		title,
		theme,
		description,
		date,
		image,
	})

	return excursion
}

export const findByIdAndDelete = async (id) => {
	const excursion = await Excursion.findByIdAndDelete(id)

	return excursion
}

export const attachComment = async (commentId, excursionId) => {
	const excursion = await Excursion.findOneAndUpdate(
		{ _id: excursionId },
		{ $push: { comments: commentId } }
	)

	return excursion
}

export const getExcursionRatingById = async id => {
	const { rating } = await findById(id)
	let average = 0

	if (rating?.length > 0) {
		average =
			rating.reduce((accumulator, elem) => accumulator + elem, 0) /
			rating.length
	}

	return {
		rating,
		average,
	}
}

export const rateExcursionById = async (id, rating) => {
	await findById(id)

	const excursion = await Excursion.findOneAndUpdate(
		{ _id: id },
		{ $push: { rating } },
		{ new: true }
	)

	return excursion
}
