const { s3 } = require("../config/aws");
const crypto = require("crypto");

// function to upload a file returning a promise
const uploadToS3 = async (buffer, name, type) => {
	const params = {
		ACL: "public-read",
		Body: buffer,
		Bucket: process.env.S3_BUCKET,
		ContentType: type,
		Key: `${name}`,
	};
	try {
		return await s3.upload(params).promise();
	} catch (e) {
		console.log(e.message);
	}
};

// get objects from bucket
const getS3files = async (req, res) => {
	try {
		const params = {
			Bucket: process.env.S3_BUCKET,
		};
		const data = await s3.listObjectsV2(params).promise();

		return res.send({
			files: data.Contents,
		});
	} catch (error) {
		return res.status(500).send({
			error: error.message,
		});
	}
};

//generates hash by taking in filename and file size

const createHashFromFileStats = (fileName, fileSize) =>
	new Promise((resolve) => {
		const hash = crypto.createHash("sha256");
		const fileType = fileName.split(".")[1];
		const calculateHashBy = fileName + fileSize;
		resolve(
			hash.update(calculateHashBy, "utf8").digest("hex") + `.${fileType}`
		);
	});

// key is hash which used to check for existing s3 object
const S3ObjectExists = async (Key) => {
	try {
		const params = {
			Bucket: process.env.S3_BUCKET,
			Key,
		};
		const data = await s3.getObject(params).promise();
		return data;
	} catch (error) {
		console.error(error.message);
	}
};

module.exports = {
	uploadToS3,
	getS3files,
	S3ObjectExists,
	createHashFromFileStats,
};
