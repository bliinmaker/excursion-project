import fs from 'fs'
import { pipeline } from 'stream/promises'
import { v4 as uuidv4 } from 'uuid'

const uploadFileTypes = ['jpg', 'png', 'jpeg']
const uploadFilePath = './uploads/images'


export const createUploadImage = async imageData => {
	const extension = imageData.filename.split('.').pop()
	if (!uploadFileTypes.includes(extension)) {
		throw new Error(
			'File must be one of extension ' + uploadFileTypes.join(', ')
		)
	}

    if (!fs.existsSync(uploadFilePath)) {
        fs.mkdirSync(uploadFilePath, { recursive: true })
    }

	const fileName = uuidv4() + '-' + imageData.filename
	const uploadedFilePath = uploadFilePath + '/' + fileName

	const storedFile = fs.createWriteStream(uploadedFilePath)

	await pipeline(imageData.toBuffer(), storedFile)

	return fileName
}
