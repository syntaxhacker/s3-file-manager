var express = require("express");
var router = express.Router();
const { upload } = require("../config/multer");
const { uploadFiles, deleteS3Object } = require("../controllers/s3Controllers");

router.post("/upload_files", upload.array("files"), uploadFiles);
router.delete("/:key", deleteS3Object);

module.exports = router;
