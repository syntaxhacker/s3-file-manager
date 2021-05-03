const AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create S3 instance
// const s3 = new AWS.S3();

const s3Server = "http://localhost:4566";
// const bucketName = process.env.AWS_BUCKET_NAME

const s3 = new AWS.S3({
	endpoint: s3Server,
	s3ForcePathStyle: true,
});

module.exports = { s3 };
