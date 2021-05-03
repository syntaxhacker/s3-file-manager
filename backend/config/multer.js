const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fieldSize: 1 * 1024 * 1024 }, //1mb
});

module.exports = { upload };
