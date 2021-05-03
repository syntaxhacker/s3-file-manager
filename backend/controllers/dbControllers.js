const { createHashFromFileStats } = require("../helpers/helpers");
const { pool } = require("../utils/pgconnect");
const getDbContents = async (req, res) => {
	try {
		pool.query(
			"select f_id id, name ,hash, size , url s3_url , created_on from files",
			(error, results) => {
				if (error) {
					throw new Error(error.message);
				}
				res.status(200).json(results.rows);
			}
		);
	} catch (error) {
		return res.status(500).send({
			error: error.message,
		});
	}
};

const addDataToDb = async (req, res) => {
	try {
		const { s3Response, filesData } = req.body;
		const combinedData = [];
		filesData.forEach((i, idx) => {
			if (s3Response[idx].key !== undefined) {
				combinedData.push({
					...i,
					key: s3Response[idx].key,
					url: s3Response[idx].Location,
				});
			}
		});

		if (!combinedData.length) {
			throw new Error("Duplicates Not allowed");
		}

		const UploadedFiles = combinedData.filter(async (i) => {
			const calculatedHASH = await createHashFromFileStats(
				i.name,
				i.size
			);
			return calculatedHASH == i.key;
		});

		let values = ``;

		for (let i = 0; i < UploadedFiles.length; i++) {
			values += `('${UploadedFiles[i].name}' , '${
				UploadedFiles[i].key
			}' , '${UploadedFiles[i].type}' ,${UploadedFiles[i].size} , '${
				UploadedFiles[i].url
			}') ${i !== UploadedFiles.length - 1 ? "," : ""} `;
		}

		const query = `
		insert into files ("name" , hash , "type" , "size" , url )
	values ${values} returning f_id id, name ,hash, size , url s3_url , created_on `;

		pool.query(query, (error, results) => {
			if (error) {
				throw new Error(error);
			}
			res.status(200).json({
				status: true,
				data: results.rows,
			});
		});
	} catch (error) {
		return res.status(500).send({
			error: error.message,
		});
	}
};

const deleteFile = async (req, res) => {
	const { key } = req.params;
	try {
		pool.query(
			`DELETE from files where hash = $1 returning name`,
			[key],
			(error, results) => {
				if (error) {
					new Error(error.message);
				}
				res.status(200).json(results.rows);
			}
		);
	} catch (error) {
		return res.status(500).send({
			error: error.message,
		});
	}
};

module.exports = {
	addDataToDb,
	deleteFile,
	getDbContents,
};
