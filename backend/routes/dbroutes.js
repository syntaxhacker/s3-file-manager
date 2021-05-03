var express = require("express");
const {
	getDbContents,
	addDataToDb,
	deleteFile,
} = require("../controllers/dbControllers");
var router = express.Router();

router.get("/", getDbContents);
router.post("/add", addDataToDb);
router.delete("/:key", deleteFile);

module.exports = router;
