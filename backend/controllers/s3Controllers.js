const {
	S3ObjectExists,
	createHashFromFileStats,
	uploadToS3,
} = require("../helpers/helpers");
const { s3 } = require("../config/aws");

const uploadFiles = async (req, res) => {
	try {
		if (!req.files) {
			throw new Error("no files to upload");
		}
		const uploadedFilesInfo = [];
		for (let file of req.files) {
			const buff = Buffer.from(file.buffer, "utf8");
			const type = file.mimetype;
			const fileName = await createHashFromFileStats(
				file.originalname,
				file.size
			);

			if ((await S3ObjectExists(fileName)) !== undefined) {
				console.log(`skipping existing file ${file.originalname} `);
				uploadedFilesInfo.push({});
				continue;
			}
			console.log(`uploading ${fileName}`);
			const data = await uploadToS3(buff, fileName, type);
			uploadedFilesInfo.push(data);
		}
		if (!uploadedFilesInfo.length) {
			throw new Error("duplicate files cant be uploaded");
		}
		return res.json({ uploadedFilesInfo });
	} catch (error) {
		return res.status(500).send({
			error: error.message,
		});
	}
};

const deleteS3Object = async (req, res) => {
	const { key: Key } = req.params;
	try {
		if ((await S3ObjectExists(Key)) !== undefined) {
			const params = {
				Bucket: process.env.S3_BUCKET,
				Key,
			};
			const data = await s3.deleteObject(params).promise();
			res.status(200).json({
				data,
			});
		} else {
			throw new Error("S3 object doesnt exist ");
		}
	} catch (error) {
		return res.status(500).send({
			error: error.message,
		});
	}
};

module.exports = {
	deleteS3Object,
	uploadFiles,
};
